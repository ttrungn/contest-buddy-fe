import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Settings,
  Crown,
  MapPin,
  Calendar,
  Trophy,
  Target,
  Copy,
  MoreVertical,
  UserPlus,
  MessageSquare,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreateTeamModal, EditTeamModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import {
  getUserTeams,
  getUserInvitations,
  createTeam,
  updateTeam,
  clearTeamsError,
  deleteTeam,
  acceptTeamInvitation,
  rejectTeamInvitation,
  leaveTeam,
} from "@/services/features/teams/teamsSlice";
import { Team, TeamInvitation, CreateTeamRequest, UpdateTeamRequest } from "@/interfaces/ITeam";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Teams() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Redux state
  const { teams, invitations, isLoading, error } = useAppSelector((state) => state.teams);
  const { user } = useAppSelector((state) => state.auth);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("my-teams");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  
  // Create team form state
  const [createForm, setCreateForm] = useState<CreateTeamRequest>({
    name: "",
    description: "",
    max_members: 5,
  });
  
  // Edit team form state
  const [editForm, setEditForm] = useState<UpdateTeamRequest>({
    name: "",
    description: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getUserTeams());
    dispatch(getUserInvitations());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Lỗi",
        description: error,
        variant: "destructive",
      });
      dispatch(clearTeamsError());
    }
  }, [error, toast, dispatch]);

  // Filter teams based on search query
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user's teams - API already returns teams where user is involved
  // So we don't need to filter by leader_id, just show all teams returned by API
  const myTeams = teams;

  // Get pending invitations
  const myInvitations = invitations.filter(
    (inv) => inv.status === "pending",
  );

  // Handler functions
  const handleCreateTeam = async (data: CreateTeamRequest) => {
    try {
      await dispatch(createTeam(data)).unwrap();
      toast({
        title: "Thành công",
        description: "Tạo team thành công",
      });
      setIsCreateTeamOpen(false);
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setEditForm({
      name: team.name,
      description: team.description,
    });
    setIsEditTeamOpen(true);
  };

  const handleUpdateTeam = async (data: UpdateTeamRequest) => {
    if (!editingTeam) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy team để cập nhật",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(updateTeam({ teamId: editingTeam.id, teamData: data })).unwrap();
      toast({
        title: "Thành công",
        description: "Cập nhật team thành công",
      });
      setIsEditTeamOpen(false);
      setEditingTeam(null);
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      await dispatch(deleteTeam(teamToDelete.id)).unwrap();
      toast({
        title: "Thành công",
        description: "Đã xóa nhóm thành công",
      });
      setIsDeleteTeamOpen(false);
      setTeamToDelete(null);
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const handleDeleteTeamClick = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteTeamOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "recruiting":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "disbanded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTeamStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "recruiting":
        return "Đang tuyển thành viên";
      case "completed":
        return "Đã hoàn thành";
      case "disbanded":
        return "Đã giải tán";
      default:
        return status;
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await dispatch(acceptTeamInvitation(invitationId)).unwrap();
      toast({
        title: "Thành công",
        description: "Đã chấp nhận lời mời tham gia nhóm",
      });
      // Refresh both teams and invitations
      dispatch(getUserTeams());
      dispatch(getUserInvitations());
      // Switch to teams tab to show the new team
      setSelectedTab("my-teams");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể chấp nhận lời mời",
        variant: "destructive",
      });
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await dispatch(rejectTeamInvitation(invitationId)).unwrap();
      toast({
        title: "Thành công",
        description: "Đã từ chối lời mời tham gia nhóm",
      });
      // Refresh invitations list
      dispatch(getUserInvitations());
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể từ chối lời mời",
        variant: "destructive",
      });
    }
  };

  const handleLeaveTeam = async (team: Team) => {
    if (!user?.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(leaveTeam({ teamId: team.id, memberId: user.id })).unwrap();
      toast({
        title: "Thành công",
        description: "Đã rời khỏi nhóm thành công",
      });
      // Refresh teams list
      dispatch(getUserTeams());
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể rời khỏi nhóm",
        variant: "destructive",
      });
    }
  };


  const TeamCard = ({ team }: { team: Team }) => {
    const isLeader = team.leader_id === user?.id;
    const isMyTeam = true; // All teams from API are user's teams

    return (
      <Card className="card-hover cursor-pointer" onClick={() => navigate(`/teams/${team.id}`)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 w-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src={team.avatar_url || ""} alt={team.name} />
                <AvatarFallback>
                  {team.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-lg text-left">{team.name}</h3>
                  <Badge className={getTeamStatusColor(team.status)}>
                    {getTeamStatusLabel(team.status)}
                  </Badge>
                  {isLeader ? (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      <Crown className="h-3 w-3 mr-1" />
                      Trưởng nhóm
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Thành viên
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2 text-left">
                  {team.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground text-left">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Tối đa {team.max_members} thành viên
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(team.created_at)}
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teams/${team.id}`);
                }}>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nhắn tin nhóm
                </DropdownMenuItem>
                {isLeader && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleEditTeam(team);
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Settings className="h-4 w-4 mr-2" />
                      Cài đặt nhóm
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeamClick(team);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Giải tán nhóm
                    </DropdownMenuItem>
                  </>
                )}
                {!isLeader && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeaveTeam(team);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Rời nhóm
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>
    );
  };



  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý nhóm</h1>
            <p className="text-muted-foreground">
              Tạo nhóm, quản lý thành viên và cùng nhau chinh phục các cuộc thi
            </p>
          </div>
          <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo nhóm mới
              </Button>
            </DialogTrigger>
            <CreateTeamModal
              isOpen={isCreateTeamOpen}
              onClose={() => setIsCreateTeamOpen(false)}
              onSubmit={handleCreateTeam}
              isLoading={isLoading}
            />
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhóm theo tên, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-teams">
              Nhóm tham gia ({myTeams.length})
            </TabsTrigger>
            <TabsTrigger value="invitations">
              Lời mời ({myInvitations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-teams" className="space-y-6 mt-6">
            {isLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Đang tải...</p>
                </CardContent>
              </Card>
            ) : myTeams.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Bạn chưa tham gia nhóm nào
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Tạo nhóm mới hoặc tham gia nhóm hiện có để bắt đầu hành
                    trình thi đấu
                  </p>
                  <Button onClick={() => setIsCreateTeamOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo nhóm đầu tiên
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myTeams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invitations" className="space-y-6 mt-6">
            {myInvitations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Không có lời mời nào
                  </h3>
                  <p className="text-muted-foreground">
                    Bạn sẽ thấy các lời mời tham gia nhóm ở đây
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myInvitations.map((invitation) => (
                  <Card key={invitation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={invitation.inviter_avatar_url} alt={invitation.inviter_full_name} />
                          <AvatarFallback>
                            {invitation.inviter_full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || invitation.inviter_username?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-left">
                              {invitation.team_name || "Nhóm không xác định"}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              • {formatDate(invitation.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 text-left">
                            <span className="font-medium">
                              {invitation.inviter_full_name || invitation.inviter_username || "Người dùng không xác định"}
                            </span>{" "}
                            đã mời bạn tham gia nhóm
                          </p>
                          {invitation.message && (
                            <p className="text-sm text-muted-foreground text-left">
                              "{invitation.message}"
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectInvitation(invitation.id)}
                          >
                            Từ chối
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptInvitation(invitation.id)}
                          >
                            Chấp nhận
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Dialogs */}
        <CreateTeamModal
          isOpen={isCreateTeamOpen}
          onClose={() => setIsCreateTeamOpen(false)}
          onSubmit={handleCreateTeam}
          isLoading={isLoading}
        />
        <EditTeamModal
          isOpen={isEditTeamOpen}
          onClose={() => setIsEditTeamOpen(false)}
          onSubmit={handleUpdateTeam}
          team={editingTeam}
          isLoading={isLoading}
        />
        
        {/* Delete Team Dialog */}
        <Dialog open={isDeleteTeamOpen} onOpenChange={setIsDeleteTeamOpen}>
        <DialogContent
          aria-hidden={false}
          data-aria-hidden={false}
        >
          <DialogHeader>
            <DialogTitle>Xác nhận giải tán nhóm</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Tất cả dữ liệu nhóm sẽ bị xóa vĩnh viễn.
            </DialogDescription>
          </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Bạn có chắc chắn muốn giải tán nhóm <strong>{teamToDelete?.name}</strong>?
                Tất cả dữ liệu nhóm sẽ bị xóa vĩnh viễn và không thể hoàn tác.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteTeamOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteTeam}>
                Giải tán nhóm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}