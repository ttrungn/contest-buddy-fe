import { useEffect, useState, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import PaginationShadcn from "@/components/ui/pagination-shadcn";
import { mockCompetitionManagement } from "@/lib/mockData";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchOrganizerCompetitions, fetchCompetitionDetail, updateCompetition, deleteCompetition, fetchCompetitionParticipants } from "@/services/features/competitions/competitionsSlice";
import { createCompetitionPayment, clearPaymentData } from "@/services/features/payment/paymentSlice";
import CompetitionModals from "@/components/modals/CompetitionModals";
import { CompetitionManagement, CompetitionParticipant, Competition, ManagementStatus, COMPETITION_PAYING_STATUSES, CompetitionPaymentStatus } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function CompetitionManagementPage() {
  const dispatch = useAppDispatch();
  const { list, participants, participantsPagination, isLoading, error } = useAppSelector((s) => s.competitions);
  const { paymentUrl, paymentData, isLoading: isPaymentLoading } = useAppSelector((s) => s.payment);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchOrganizerCompetitions({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Clear payment data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearPaymentData());
    };
  }, [dispatch]);

  // Normalize status coming from API (supports Vietnamese labels or code strings)
  const normalizeStatus = (status: string | undefined | null): string => {
    if (!status) return "registration_open";
    const raw = String(status);
    const lower = raw.toLowerCase();
    // If already our internal codes
    const codeMatches = [
      "registration_open",
      "registration_closed",
      "in_progress",
      "ongoing",
      "completed",
      "cancelled",
    ];
    if (codeMatches.includes(lower)) return lower;
    // Map Vietnamese labels to codes
    switch (raw) {
      case "Đang mở đăng ký":
        return "registration_open";
      case "Đã đóng đăng ký":
        return "registration_closed";
      case "Đang diễn ra":
        return "in_progress";
      case "Đã hoàn thành":
      case "Hoàn thành":
        return "completed";
      case "Đã hủy":
        return "cancelled";
      default:
        return lower;
    }
  };

  // Convert API data to CompetitionManagement format
  const competitions = list
    .filter((comp) => comp && comp.id) // Filter out null/undefined items
    .map((comp: any) => {

      return {
        id: `mgmt-${comp.id}`,
        competitionId: comp.id,
        competition: {
          id: comp.id,
          title: comp.title,
          description: comp.description || "",
          category: comp.category || "other",
          organizer: "Current Organizer",
          startDate: comp.start_date ? new Date(comp.start_date) : new Date(),
          endDate: comp.end_date ? new Date(comp.end_date) : new Date(),
          registrationDeadline: comp.registration_deadline ? new Date(comp.registration_deadline) : new Date(),
          location: comp.location || "TBA",
          isOnline: false,
          prizePool: comp.prize_pool_text || "TBA",
          participants: comp.participants_count || 0,
          maxParticipants: comp.max_participants || 100,
          requiredSkills: comp.competitionRequiredSkills || [],
          level: comp.level || "beginner",
          tags: comp.competitionTags || [],
          imageUrl: comp.image_url,
          website: comp.website,
          rules: comp.rules,
          featured: comp.featured || false,
          status: comp.status || "registration_open",
          isRegisteredAsTeam: comp.isRegisteredAsTeam || false,
          maxParticipantsPerTeam: comp.maxParticipantsPerTeam || 1,
          payingStatus: comp.paying_status || comp.payment_status || "Chưa thanh toán",
          paymentStatus: comp.payment_status || comp.paying_status || "UNPAID",
        },
        organizerId: comp.organizer_id || "current-organizer",
        organizer: {
          id: comp.organizer_id || "current-organizer",
          name: "Current Organizer",
          email: "organizer@example.com",
          avatar: undefined,
        },
        status: (comp.status as ManagementStatus) || "registration_open",
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          allowLateRegistration: false,
          autoApproveRegistrations: true,
          maxParticipants: comp.max_participants || 100,
          registrationFee: 0,
          emailNotifications: true,
          publicLeaderboard: true,
          allowTeamRegistration: comp.isRegisteredAsTeam || false,
          maxTeamSize: comp.maxParticipantsPerTeam || 5,
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
          totalRegistrations: comp.participants_count || 0,
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
    });

  const [selectedCompetition, setSelectedCompetition] = useState(
    competitions[0] || null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [participantsPage, setParticipantsPage] = useState(1);
  const [participantsLimit, setParticipantsLimit] = useState(10);
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
        // Select the first available competition
        setSelectedCompetition(competitions[0]);
      }
    } else {
      // No competitions available, clear selection
      setSelectedCompetition(null);
    }
  }, [competitions]); // Only depend on competitions to avoid infinite loop

  // Fetch participants when selected competition changes (without pagination params)
  useEffect(() => {
    if (selectedCompetition?.competitionId) {
      dispatch(fetchCompetitionParticipants({
        id: selectedCompetition.competitionId,
        page: 1,
        limit: 1000 // Get all participants, paginate on frontend
      }));
    }
  }, [selectedCompetition?.competitionId, dispatch]);

  // Handle dialog closing - removed problematic useEffect

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
    // If already a Vietnamese label, return it
    const viLabels = [
      "Đang mở đăng ký",
      "Đã đóng đăng ký",
      "Đang diễn ra",
      "Đã hoàn thành",
      "Hoàn thành",
      "Đã hủy",
    ];
    if (viLabels.includes(status)) return status;

    switch (normalizeStatus(status)) {
      case "registration_open":
        return "Đang mở đăng ký";
      case "registration_closed":
        return "Đã đóng đăng ký";
      case "in_progress":
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getCompetitionStatusColor = (status: string) => {
    switch (normalizeStatus(status)) {
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

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.user.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      participant.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Frontend pagination for participants
  const totalParticipants = filteredParticipants.length;
  const totalPages = Math.ceil(totalParticipants / participantsLimit);
  const startIndex = (participantsPage - 1) * participantsLimit;
  const endIndex = startIndex + participantsLimit;
  const paginatedParticipants = filteredParticipants.slice(startIndex, endIndex);

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

  const resetDeleteStates = () => {
    setCompetitionToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setCompetitionToDelete(null);
  }, []);

  // Pagination handlers
  const handleParticipantsPageChange = (page: number) => {
    setParticipantsPage(page);
  };

  const handleParticipantsItemsPerPageChange = (limit: number) => {
    setParticipantsLimit(limit);
    setParticipantsPage(1); // Reset to first page when changing items per page
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

      // Clear the selected competition if it's the one being deleted
      if (selectedCompetition && selectedCompetition.competitionId === competitionToDelete.competitionId) {
        setSelectedCompetition(null);
      }

      // Reset delete-related states
      resetDeleteStates();

      // Note: No need to fetch competitions again as Redux slice already updates the list
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error || "Có lỗi xảy ra khi xóa cuộc thi",
        variant: "destructive",
      });
      // Reset states even on error
      resetDeleteStates();
    }
  };

  const handleUpdateSuccess = () => {
    // Show success toast
    toast({
      title: "Thành công!",
      description: "Cuộc thi đã được cập nhật thành công",
    });

    // Refresh the competitions list
    dispatch(fetchOrganizerCompetitions({ page: 1, limit: 50 }));

    setIsUpdateModalOpen(false);
    setCompetitionToUpdate(null);
  };

  // Handle payment for competition
  const handlePayment = async (competitionId: string) => {
    try {
      console.log('Creating payment for competition:', competitionId);
      const result = await dispatch(createCompetitionPayment({ competitionId })).unwrap();

      console.log('Payment result:', result);

      if (result.success && result.data.order.result.checkoutUrl) {
        const checkoutUrl = result.data.order.result.checkoutUrl;
        const orderCode = result.data.order.result.orderCode;
        const amount = result.data.order.result.amount;

        console.log('Redirecting to checkout URL:', checkoutUrl);

        // Add callback URLs to checkout URL
        const successUrl = `${window.location.origin}/payment/return`;
        const cancelUrl = `${window.location.origin}/payment/cancel`;

        // Add callback URLs as query parameters
        const urlWithCallbacks = new URL(checkoutUrl);
        urlWithCallbacks.searchParams.set('returnUrl', successUrl);
        urlWithCallbacks.searchParams.set('cancelUrl', cancelUrl);

        console.log('Final checkout URL with callbacks:', urlWithCallbacks.toString());

        // Redirect to payment URL
        window.open(urlWithCallbacks.toString(), '_blank');

        toast({
          title: "Chuyển hướng thanh toán",
          description: "Đang chuyển hướng đến trang thanh toán...",
        });
      } else {
        console.error('No checkout URL found in response:', result);
        toast({
          title: "Lỗi thanh toán",
          description: "Không tìm thấy URL thanh toán",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Lỗi thanh toán",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  // Get payment status for competition
  const getPaymentStatus = (competition: any): CompetitionPaymentStatus => {
    // Check multiple possible fields for payment status
    const paymentStatus = competition?.competition?.paymentStatus ||
      competition?.competition?.payingStatus ||
      competition?.paymentStatus ||
      competition?.payingStatus;


    // Convert Vietnamese status to English
    if (paymentStatus === "Đã thanh toán" || paymentStatus === "PAID") {
      return "PAID";
    } else if (paymentStatus === "Hết hạn" || paymentStatus === "EXPIRED") {
      return "EXPIRED";
    }

    return "UNPAID";
  };

  // Get payment status color
  const getPaymentStatusColor = (status: CompetitionPaymentStatus) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-200";
      case "UNPAID":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "EXPIRED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
              <Button onClick={() => dispatch(fetchOrganizerCompetitions({ page: 1, limit: 50 }))}>
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
                    {participantsPagination?.total || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tổng đăng ký
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      competitions.filter((comp) => comp.competition.payingStatus === "Đã thanh toán")
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Đã thanh toán
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
                  {competitions.map((comp) => {
                    const paymentStatus = getPaymentStatus(comp);
                    const needsPayment = paymentStatus === "UNPAID" || paymentStatus === "EXPIRED";

                    return (
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
                          {/* Payment Status */}
                          <div className="mt-1">
                            <Badge
                              className={cn(
                                "text-xs",
                                getPaymentStatusColor(paymentStatus)
                              )}
                            >
                              {COMPETITION_PAYING_STATUSES[paymentStatus]}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={cn(
                              "ml-2",
                              getCompetitionStatusColor(comp.status || "registration_open")
                            )}
                          >
                            {getCompetitionStatusLabel(comp.status || "registration_open")}
                          </Badge>
                          {/* Payment Button */}
                          {needsPayment && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePayment(comp.competitionId);
                              }}
                              disabled={isPaymentLoading}
                              className="text-xs"
                            >
                              {isPaymentLoading ? "Đang xử lý..." : "Thanh toán"}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                          <span className="font-medium">
                            {comp.competition.title}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const paymentStatus = getPaymentStatus(selectedCompetition);
                    const needsPayment = paymentStatus === "UNPAID" || paymentStatus === "EXPIRED";
                    if (!needsPayment) return null;
                    return (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePayment(selectedCompetition.competitionId)}
                        disabled={isPaymentLoading}
                      >
                        {isPaymentLoading ? "Đang xử lý..." : "Thanh toán"}
                      </Button>
                    );
                  })()}
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
                          getCompetitionStatusColor(selectedCompetition?.status || "registration_open")
                        )}
                      >
                        {getCompetitionStatusLabel(selectedCompetition?.status || "registration_open")}
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
                          {participantsPagination?.total || 0} đăng
                          ký
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedCompetition?.competition?.payingStatus || "Chưa thanh toán"}
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="participants">Thí sinh</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Tổng đăng ký"
                  value={participantsPagination?.total || 0}
                  icon={Users}
                  color="text-blue-600"
                  change="+12% so với tuần trước"
                />
                <StatCard
                  title="Trạng thái thanh toán"
                  value={selectedCompetition?.competition?.payingStatus || "Chưa thanh toán"}
                  icon={DollarSign}
                  color="text-green-600"
                  change=""
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
                          {participantsPagination?.total || 0}/
                          {selectedCompetition?.settings?.maxParticipants || 100}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((participantsPagination?.total || 0) /
                            (selectedCompetition?.settings?.maxParticipants || 100)) *
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
                        <span>Trạng thái</span>
                        <span>
                          {selectedCompetition?.competition?.payingStatus || "Chưa thanh toán"}
                        </span>
                      </div>
                      <Progress
                        value={selectedCompetition?.competition?.payingStatus === "Đã thanh toán" ? 100 : 0}
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
                    {paginatedParticipants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={participant.user.avatar_url}
                                alt={participant.user.full_name}
                              />
                              <AvatarFallback>
                                {participant.user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {participant.user.full_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                @{participant.user.username}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{participant.user.city}</TableCell>
                        <TableCell>
                          {formatDate(new Date(participant.registration_date))}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(participant.status)}>
                            {getStatusLabel(participant.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(participant.payment_status)}
                          >
                            {getStatusLabel(participant.payment_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(
                              participant.submission_status,
                            )}
                          >
                            {getStatusLabel(participant.submission_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {participant.user.rating ? (
                            <span className="font-medium">
                              {participant.user.rating}/5
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

              {/* Pagination for participants */}
              {totalParticipants > 0 && (
                <PaginationShadcn
                  currentPage={participantsPage}
                  totalPages={totalPages}
                  totalItems={totalParticipants}
                  itemsPerPage={participantsLimit}
                  onPageChange={handleParticipantsPageChange}
                  onItemsPerPageChange={handleParticipantsItemsPerPageChange}
                  showItemsPerPage={true}
                  showInfo={true}
                  maxVisiblePages={5}
                  className="mt-4"
                  previousLabel="Trước"
                  nextLabel="Sau"
                  itemsPerPageOptions={[5, 10, 20, 50]}
                  infoTemplate="Hiển thị {start} - {end} trong tổng số {total} thí sinh"
                />
              )}
            </TabsContent>

          </Tabs>
        )}
      </div>

      {/* Competition Modals */}
      <CompetitionModals
        isCreateModalOpen={isCreateModalOpen}
        onCreateModalClose={() => setIsCreateModalOpen(false)}
        onCreateSuccess={(newCompetition) => {
          // Refresh danh sách từ API
          dispatch(fetchOrganizerCompetitions({ page: 1, limit: 50 }));
        }}
        isUpdateModalOpen={isUpdateModalOpen}
        onUpdateModalClose={() => {
          setIsUpdateModalOpen(false);
          setCompetitionToUpdate(null);
        }}
        competitionToUpdate={competitionToUpdate}
        onUpdateSuccess={handleUpdateSuccess}
        isDeleteModalOpen={isDeleteDialogOpen}
        onDeleteModalClose={handleCloseDeleteDialog}
        onDeleteConfirm={confirmDeleteCompetition}
        competitionToDelete={competitionToDelete}
        isDeleting={isLoading}
      />
    </div>
  );
}
