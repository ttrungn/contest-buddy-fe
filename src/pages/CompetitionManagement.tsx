import { useEffect, useState } from "react";
import {
  BarChart3,
  DollarSign,
  Users,
  Trophy,
  TrendingUp,
  Calendar,
  Settings,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockCompetitionManagement } from "@/lib/mockData";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchCompetitions, fetchCompetitionDetail, updateCompetition, deleteCompetition } from "@/services/features/competitions/competitionsSlice";
import CreateCompetitionModal from "@/components/CreateCompetitionModal";
import UpdateCompetitionModal from "@/components/UpdateCompetitionModal";
import { CompetitionManagement, CompetitionParticipant, Competition, ManagementStatus } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function CompetitionManagementPage() {
  const dispatch = useAppDispatch();
  const { list, isLoading, error } = useAppSelector((s) => s.competitions);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchCompetitions({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Convert API data to CompetitionManagement format
  const competitions = list
    .filter((comp) => comp && comp.id) // Filter out null/undefined items
    .map((comp) => ({
      id: `mgmt-${comp.id}`,
      competitionId: comp.id,
      competition: {
        id: comp.id,
        title: comp.title,
        description: "",
        category: comp.category || "other",
        organizer: "Current Organizer",
        startDate: new Date(),
        endDate: new Date(),
        registrationDeadline: new Date(),
        location: "TBA",
        isOnline: false,
        prizePool: "TBA",
        participants: 0,
        maxParticipants: 100,
        requiredSkills: [],
        level: "beginner",
        tags: [],
        imageUrl: undefined,
        website: undefined,
        rules: undefined,
        featured: comp.featured || false,
        status: comp.status || "draft",
      },
      organizerId: "current-organizer",
      organizer: {
        id: "current-organizer",
        name: "Current Organizer",
        email: "organizer@example.com",
        avatar: undefined,
      },
      status: (comp.status as ManagementStatus) || "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        allowLateRegistration: false,
        autoApproveRegistrations: true,
        maxParticipants: 100,
        registrationFee: 0,
        emailNotifications: true,
        publicLeaderboard: true,
        allowTeamRegistration: true,
        maxTeamSize: 5,
      },
      finances: {
        budget: 0,
        revenue: [],
        expenses: [],
        prizePool: 0,
        sponsorships: [],
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
      },
      statistics: {
        totalRegistrations: 0,
        approvedRegistrations: 0,
        pendingRegistrations: 0,
        rejectedRegistrations: 0,
        completedSubmissions: 0,
        registrationsByDate: [],
        participantsBySchool: [],
        participantsByRegion: [],
        averageRating: 0,
        completionRate: 0,
      },
      participants: [],
    }));

  const [selectedCompetition, setSelectedCompetition] = useState(
    competitions[0] || null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [competitionToUpdate, setCompetitionToUpdate] = useState(null);
  const [competitionToDelete, setCompetitionToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Update selected competition when competitions change
  useEffect(() => {
    if (competitions.length > 0) {
      // If no competition is selected or the selected competition no longer exists
      if (!selectedCompetition || !competitions.find(comp => comp.competitionId === selectedCompetition.competitionId)) {
        setSelectedCompetition(competitions[0]);
      } else {
        // If the selected competition still exists, update it with fresh data
        const updatedCompetition = competitions.find(comp => comp.competitionId === selectedCompetition.competitionId);
        if (updatedCompetition) {
          setSelectedCompetition(updatedCompetition);
        }
      }
    } else {
      setSelectedCompetition(null);
    }
  }, [competitions]); // Only depend on competitions to avoid infinite loop

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-red-100 text-red-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "reviewed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCompetitionStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Nháp";
      case "published":
        return "Đã xuất bản";
      case "registration_open":
        return "Mở đăng ký";
      case "registration_closed":
        return "Đóng đăng ký";
      case "in_progress":
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getCompetitionStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "published":
        return "bg-blue-100 text-blue-700";
      case "registration_open":
        return "bg-green-100 text-green-700";
      case "registration_closed":
        return "bg-yellow-100 text-yellow-700";
      case "in_progress":
      case "ongoing":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      approved: "Đã duyệt",
      pending: "Chờ duyệt",
      rejected: "Từ chối",
      paid: "Đã thanh toán",
      unpaid: "Chưa thanh toán",
      submitted: "Đã nộp",
      reviewed: "Đã chấm",
      "not-submitted": "Chưa nộp",
    };
    return labels[status] || status;
  };

  const filteredParticipants = selectedCompetition?.participants?.filter(
    (participant) =>
      participant.user.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      participant.user.school.toLowerCase().includes(searchQuery.toLowerCase()),
  ) || [];

  const handleUpdateCompetition = async (competition: any) => {
    try {
      // Fetch the latest competition detail
      const result = await dispatch(fetchCompetitionDetail(competition.competitionId)).unwrap();
      setCompetitionToUpdate(result);
      setIsUpdateModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch competition detail:", error);
    }
  };

  const handleDeleteCompetition = (competition: any) => {
    setCompetitionToDelete(competition);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCompetition = async () => {
    if (!competitionToDelete) return;

    try {
      await dispatch(deleteCompetition(competitionToDelete.competitionId)).unwrap();
      
      // Show success toast
      toast({
        title: "Thành công!",
        description: "Cuộc thi đã được xóa thành công",
      });
      
      // Refresh the competitions list
      dispatch(fetchCompetitions({ page: 1, limit: 50 }));
      
      setCompetitionToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error || "Có lỗi xảy ra khi xóa cuộc thi",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSuccess = () => {
    // Show success toast
    toast({
      title: "Thành công!",
      description: "Cuộc thi đã được cập nhật thành công",
    });
    
    // Refresh the competitions list
    dispatch(fetchCompetitions({ page: 1, limit: 50 }));
    
    setIsUpdateModalOpen(false);
    setCompetitionToUpdate(null);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    change,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    change?: string;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-muted-foreground mt-1">{change}</p>
            )}
          </div>
          <Icon className={cn("h-8 w-8", color)} />
        </div>
      </CardContent>
    </Card>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải danh sách cuộc thi...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Lỗi tải dữ liệu</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => dispatch(fetchCompetitions({ page: 1, limit: 50 }))}>
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý cuộc thi</h1>
            <p className="text-muted-foreground">
              Dashboard quản lý dành cho ban tổ chức • {competitions.length}{" "}
              cuộc thi
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo cuộc thi mới
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {competitions.length === 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có cuộc thi nào</h3>
                <p className="text-muted-foreground mb-4">
                  Bắt đầu tạo cuộc thi đầu tiên của bạn
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo cuộc thi mới
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Organization Overview */}
        {competitions.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tổng quan tổ chức</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {competitions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tổng cuộc thi
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {competitions.reduce(
                      (total, comp) =>
                        total + comp.statistics.totalRegistrations,
                      0,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tổng đăng ký
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(
                      competitions.reduce(
                        (total, comp) => total + comp.finances.totalRevenue,
                        0,
                      ),
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tổng doanh thu
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      competitions.filter((comp) => comp.status === "ongoing")
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Đang diễn ra
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="text-sm font-medium">Danh sách cuộc thi:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {competitions.map((comp) => (
                    <div
                      key={comp.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedCompetition?.id === comp.id
                          ? "border-purple-200 bg-purple-50"
                          : "hover:bg-gray-50",
                      )}
                      onClick={() => setSelectedCompetition(comp)}
                    >
                      <div className="flex-1">
                        <div className="font-medium truncate">
                          {comp.competition.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {comp.statistics.totalRegistrations} đăng ký •{" "}
                          {formatDate(comp.competition.startDate)}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "ml-2",
                          getCompetitionStatusColor(comp.status || "draft")
                        )}
                      >
                        {getCompetitionStatusLabel(comp.status || "draft")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Competition Details */}
        {selectedCompetition && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CardTitle>Đang quản lý:</CardTitle>
                  <Select
                    value={selectedCompetition?.id || ""}
                    onValueChange={(value) => {
                      const competition = competitions.find(
                        (comp) => comp.id === value,
                      );
                      if (competition) {
                        setSelectedCompetition(competition);
                      }
                    }}
                  >
                    <SelectTrigger className="w-80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {competitions.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">
                              {comp.competition.title}
                            </span>
                            <Badge
                              className={cn(
                                "ml-2",
                                getCompetitionStatusColor(comp.status || "draft")
                              )}
                            >
                              {getCompetitionStatusLabel(comp.status || "draft")}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem trang thi
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateCompetition(selectedCompetition)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Chỉnh sửa
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdateCompetition(selectedCompetition)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteCompetition(selectedCompetition)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Xóa cuộc thi
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        {selectedCompetition?.competition?.title || "N/A"}
                      </h3>
                      <Badge
                        className={cn(
                          getCompetitionStatusColor(selectedCompetition?.status || "draft")
                        )}
                      >
                        {getCompetitionStatusLabel(selectedCompetition?.status || "draft")}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {selectedCompetition?.competition?.description || "N/A"}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(selectedCompetition?.competition?.startDate)}{" "}
                          - {formatDate(selectedCompetition?.competition?.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedCompetition?.statistics?.totalRegistrations || 0} đăng
                          ký
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatCurrency(
                            selectedCompetition?.finances?.totalRevenue || 0,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedCompetition?.statistics?.completionRate || 0}% hoàn
                          thành
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Tabs */}
        {selectedCompetition && (
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="participants">Thí sinh</TabsTrigger>
              <TabsTrigger value="finances">Tài chính</TabsTrigger>
              <TabsTrigger value="statistics">Thống kê</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Tổng đăng ký"
                  value={selectedCompetition?.statistics?.totalRegistrations || 0}
                  icon={Users}
                  color="text-blue-600"
                  change="+12% so với tuần trước"
                />
                <StatCard
                  title="Doanh thu"
                  value={formatCurrency(
                    selectedCompetition?.finances?.totalRevenue || 0,
                  )}
                  icon={DollarSign}
                  color="text-green-600"
                  change="78% hoàn thành m��c tiêu"
                />
                <StatCard
                  title="Tỷ lệ hoàn thành"
                  value={`${selectedCompetition?.statistics?.completionRate || 0}%`}
                  icon={TrendingUp}
                  color="text-purple-600"
                  change="Tăng 5% so với dự kiến"
                />
                <StatCard
                  title="Đánh giá trung bình"
                  value={selectedCompetition?.statistics?.averageRating || 0}
                  icon={Trophy}
                  color="text-yellow-600"
                  change="4.6/5.0 sao"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            35 đăng ký mới được duyệt
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 giờ trước
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Nhận thanh toán 25,000,000 VNĐ
                          </p>
                          <p className="text-xs text-muted-foreground">
                            5 giờ trước
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            15 bài nộp cần được chấm điểm
                          </p>
                          <p className="text-xs text-muted-foreground">
                            1 ngày trước
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tiến độ cuộc thi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Đăng ký</span>
                        <span>
                          {selectedCompetition?.statistics?.totalRegistrations || 0}/
                          {selectedCompetition?.settings?.maxParticipants || 0}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((selectedCompetition?.statistics?.totalRegistrations || 0) /
                            (selectedCompetition?.settings?.maxParticipants || 1)) *
                          100
                        }
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Bài nộp</span>
                        <span>
                          {selectedCompetition?.statistics?.completedSubmissions || 0}/
                          {selectedCompetition?.statistics?.approvedRegistrations || 0}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((selectedCompetition?.statistics?.completedSubmissions || 0) /
                            (selectedCompetition?.statistics?.approvedRegistrations || 1)) *
                          100
                        }
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Ngân sách</span>
                        <span>
                          {formatCurrency(
                            selectedCompetition?.finances?.totalExpenses || 0,
                          )}
                          /{formatCurrency(selectedCompetition?.finances?.budget || 0)}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((selectedCompetition?.finances?.totalExpenses || 0) /
                            (selectedCompetition?.finances?.budget || 1)) *
                          100
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Participants Tab */}
            <TabsContent value="participants" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm thí sinh..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="approved">Đã duyệt</SelectItem>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Xuất danh sách
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thí sinh</TableHead>
                      <TableHead>Trường</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead>Bài nộp</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={participant.user.avatar}
                                alt={participant.user.fullName}
                              />
                              <AvatarFallback>
                                {participant.user.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {participant.user.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                @{participant.user.username}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{participant.user.school}</TableCell>
                        <TableCell>
                          {formatDate(participant.registrationDate)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(participant.status)}>
                            {getStatusLabel(participant.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(participant.paymentStatus)}
                          >
                            {getStatusLabel(participant.paymentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(
                              participant.submissionStatus,
                            )}
                          >
                            {getStatusLabel(participant.submissionStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {participant.score ? (
                            <span className="font-medium">
                              {participant.score}/100
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Duyệt đăng ký
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Từ chối
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Finances Tab */}
            <TabsContent value="finances" className="space-y-6 mt-6">
              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Doanh thu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedCompetition.finances.totalRevenue)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCompetition.finances.revenue.length} khoản thu
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Chi phí</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedCompetition.finances.totalExpenses)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCompetition.finances.expenses.length} khoản chi
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Lợi nhuận</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedCompetition.finances.netProfit)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCompetition.finances.netProfit > 0 ? "Lãi" : "Lỗ"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Entries */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Khoản thu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCompetition.finances.revenue.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium">{entry.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.category} • {formatDate(entry.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              +{formatCurrency(entry.amount)}
                            </p>
                            <Badge className={getStatusColor(entry.status)}>
                              {getStatusLabel(entry.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Khoản chi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCompetition.finances.expenses.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium">{entry.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.category} • {formatDate(entry.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">
                              -{formatCurrency(entry.amount)}
                            </p>
                            <Badge className={getStatusColor(entry.status)}>
                              {getStatusLabel(entry.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê đăng ký theo trường</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCompetition.statistics.participantsBySchool.map(
                        (item) => (
                          <div key={item.school} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{item.school}</span>
                              <span>{item.count} thí sinh</span>
                            </div>
                            <Progress
                              value={
                                (item.count /
                                  selectedCompetition.statistics
                                    .totalRegistrations) *
                                100
                              }
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê theo khu vực</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCompetition.statistics.participantsByRegion.map(
                        (item) => (
                          <div key={item.region} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{item.region}</span>
                              <span>{item.count} thí sinh</span>
                            </div>
                            <Progress
                              value={
                                (item.count /
                                  selectedCompetition.statistics
                                    .totalRegistrations) *
                                100
                              }
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt cuộc thi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cho phép đăng ký muộn</p>
                        <p className="text-sm text-muted-foreground">
                          Thí sinh có thể đăng ký sau deadline
                        </p>
                      </div>
                      <Badge
                        className={
                          selectedCompetition.settings.allowLateRegistration
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {selectedCompetition.settings.allowLateRegistration
                          ? "Bật"
                          : "Tắt"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tự động duyệt đăng ký</p>
                        <p className="text-sm text-muted-foreground">
                          Đăng ký được duyệt tự động mà không cần review
                        </p>
                      </div>
                      <Badge
                        className={
                          selectedCompetition.settings.autoApproveRegistrations
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {selectedCompetition.settings.autoApproveRegistrations
                          ? "Bật"
                          : "Tắt"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Create Competition Modal */}
      <CreateCompetitionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newCompetition) => {
          // Tạo competition management object từ competition mới
          const newCompetitionManagement: CompetitionManagement = {
            id: `mgmt-${newCompetition.id}`,
            competitionId: newCompetition.id!,
            competition: {
              id: newCompetition.id!,
              title: newCompetition.title!,
              description: newCompetition.description!,
              category: newCompetition.category!,
              organizer: newCompetition.organizer!,
              startDate: newCompetition.startDate!,
              endDate: newCompetition.endDate!,
              registrationDeadline: newCompetition.registrationDeadline!,
              location: newCompetition.location!,
              isOnline: newCompetition.isOnline!,
              prizePool: newCompetition.prizePool,
              participants: newCompetition.participants!,
              maxParticipants: newCompetition.maxParticipants,
              requiredSkills: newCompetition.requiredSkills!,
              level: newCompetition.level!,
              tags: newCompetition.tags!,
              imageUrl: newCompetition.imageUrl,
              website: newCompetition.website,
              rules: newCompetition.rules,
              featured: newCompetition.featured!,
              status: newCompetition.status!,
            },
            organizerId: "current-organizer",
            organizer: {
              id: "current-organizer",
              name: newCompetition.organizer!,
              email: "organizer@example.com",
              avatar: undefined,
            },
            status: "published" as ManagementStatus,
            createdAt: new Date(),
            updatedAt: new Date(),
            settings: {
              allowLateRegistration: false,
              autoApproveRegistrations: true,
              maxParticipants: newCompetition.maxParticipants,
              registrationFee: 0,
              emailNotifications: true,
              publicLeaderboard: true,
              allowTeamRegistration: true,
              maxTeamSize: 5,
            },
            finances: {
              budget: 0,
              revenue: [],
              expenses: [],
              prizePool: 0,
              sponsorships: [],
              totalRevenue: 0,
              totalExpenses: 0,
              netProfit: 0,
            },
            statistics: {
              totalRegistrations: 0,
              approvedRegistrations: 0,
              pendingRegistrations: 0,
              rejectedRegistrations: 0,
              completedSubmissions: 0,
              registrationsByDate: [],
              participantsBySchool: [],
              participantsByRegion: [],
              averageRating: 0,
              completionRate: 0,
            },
            participants: [],
          };

          // Refresh danh sách từ API
          dispatch(fetchCompetitions({ page: 1, limit: 50 }));
        }}
      />

      {/* Update Competition Modal */}
      <UpdateCompetitionModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setCompetitionToUpdate(null);
        }}
        competition={competitionToUpdate}
        onSuccess={handleUpdateSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa cuộc thi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa cuộc thi "{competitionToDelete?.competition?.title}"? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCompetition}>
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
