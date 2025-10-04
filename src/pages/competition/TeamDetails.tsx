import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  User,
  Edit,
  Crown,
  Mail,
  School,
  MapPin,
  CheckCircle,
  Calendar,
  Trophy,
  MoreVertical,
  Trash2,
  UserMinus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RemoveMemberModal } from "@/components/modals";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { 
  getTeamById, 
  getTeamMembers, 
  clearTeamsError,
  changeMemberRole,
  removeTeamMember,
  deleteTeam
} from "@/services/features/teams/teamsSlice";
import { Team, TeamMember, TeamRole } from "@/interfaces/ITeam";
import { useToast } from "@/hooks/use-toast";

export default function TeamDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Redux state
  const { currentTeam, teamMembers, isLoading, error } = useAppSelector((state) => state.teams);
  const { user } = useAppSelector((state) => state.auth);
  
  // Local state
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);

  // Fetch team data on component mount
  useEffect(() => {
    if (id) {
      dispatch(getTeamById(id));
      dispatch(getTeamMembers(id));
    }
  }, [dispatch, id]);

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show not found if no team
  if (!currentTeam) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy nhóm</h1>
          <Button onClick={() => navigate("/teams")}>Quay lại danh sách nhóm</Button>
        </div>
      </div>
    );
  }

  // Get leader and members
  const leader = teamMembers.find(member => member.role === "leader" && member.status === "active");
  const members = teamMembers;

  // Xử lý mở dialog chỉnh sửa
  const handleEdit = (member: TeamMember) => {
    setEditMember(member);
    setEditData({
      fullName: member.user.full_name,
      school: member.user.school,
      skills: "", // API không trả về skills trong user object
    });
  };

  // Xử lý lưu chỉnh sửa
  const handleSave = () => {
    // TODO: Implement API call to update member
    console.log("Update member:", editData);
    setEditMember(null);
  };

  // Check if current user is leader
  const isLeader = currentTeam?.leader_id === user?.id;

  // Handle change member role
  const handleChangeRole = async (memberId: string, newRole: TeamRole) => {
    if (!currentTeam) return;
    
    try {
      await dispatch(changeMemberRole({
        teamId: currentTeam.id,
        memberId,
        roleData: { role: newRole }
      })).unwrap();
      
      toast({
        title: "Thành công",
        description: "Đã thay đổi vai trò thành viên",
      });
      
      // Refresh team members
      dispatch(getTeamMembers(currentTeam.id));
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  // Handle remove member
  const handleRemoveMember = async () => {
    if (!currentTeam || !memberToRemove) return;
    
    setIsRemovingMember(true);
    try {
      await dispatch(removeTeamMember({
        teamId: currentTeam.id,
        memberId: memberToRemove.user.id
      })).unwrap();
      
      toast({
        title: "Thành công",
        description: "Đã xóa thành viên khỏi nhóm",
      });
      
      // State is automatically updated by Redux reducer
      setIsRemoveMemberOpen(false);
      setMemberToRemove(null);
    } catch (error) {
      // Error is handled by useEffect
    } finally {
      setIsRemovingMember(false);
    }
  };

  // Handle delete team
  const handleDeleteTeam = async () => {
    if (!currentTeam) return;
    
    try {
      await dispatch(deleteTeam(currentTeam.id)).unwrap();
      
      toast({
        title: "Thành công",
        description: "Đã xóa nhóm",
      });
      
      // Navigate back to teams list
      navigate("/teams");
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button variant="ghost" onClick={() => navigate("/teams")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách nhóm
        </Button>

        {/* Thông tin nhóm */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentTeam.avatar_url || ""} alt={currentTeam.name} />
              <AvatarFallback>{currentTeam.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                {currentTeam.name}
                {currentTeam.status === "active" && (
                  <Badge variant="secondary">Đang hoạt động</Badge>
                )}
              </h1>
              <p className="text-muted-foreground mb-2">{currentTeam.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Leader: <span className="font-medium ml-1">{leader?.user.full_name || "Chưa có"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {teamMembers.filter(member => member.status === "active").length} thành viên
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Tạo ngày: {new Date(currentTeam.created_at).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Danh sách thành viên */}
        <Card>
          <CardHeader>
            <CardTitle>Thành viên nhóm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Chỉ hiển thị thành viên có status active */}
              {teamMembers.filter(member => member.status === "active").map((member) => (
                <div key={member.id} className={`border rounded-lg p-4 ${member.role === "leader" ? "bg-primary/5" : ""}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.user.avatar_url || ""} alt={member.user.full_name} />
                      <AvatarFallback>{member.user.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        {member.user.full_name}
                        {member.role === "leader" && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        {member.status === "active" && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{member.user.school}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Mail className="h-3 w-3" />
                      {member.user.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <School className="h-3 w-3" />
                      {member.user.study_field}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {member.user.city}, {member.user.region}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === "leader" ? "default" : "secondary"} className="text-xs">
                        {member.role === "leader" ? "Leader" : "Member"}
                      </Badge>
                      {isLeader && member.role !== "leader" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleChangeRole(member.user.id, "leader")}>
                              <Settings className="h-4 w-4 mr-2" />
                              Thăng làm Leader
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(member.user.id, "member")}>
                              <User className="h-4 w-4 mr-2" />
                              Hạ xuống Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setMemberToRemove(member);
                                setIsRemoveMemberOpen(true);
                              }}
                            >
                              <UserMinus className="h-4 w-4 mr-2" />
                              Xóa khỏi nhóm
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Tham gia: {new Date(member.joined_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Dialog chỉnh sửa thành viên */}
        <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin thành viên</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin chi tiết của thành viên trong nhóm
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên</label>
                <Input
                  value={editData.fullName || ""}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Trường</label>
                <Input
                  value={editData.school || ""}
                  onChange={(e) => setEditData({ ...editData, school: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kỹ năng (phân tách bằng dấu phẩy)</label>
                <Input
                  value={editData.skills || ""}
                  onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditMember(null)}>
                Hủy
              </Button>
              <Button onClick={handleSave}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Member Modal */}
        <RemoveMemberModal
          isOpen={isRemoveMemberOpen}
          onClose={() => setIsRemoveMemberOpen(false)}
          onConfirm={handleRemoveMember}
          member={memberToRemove}
          isLoading={isRemovingMember}
        />

        {/* Dialog xác nhận xóa nhóm */}
        <Dialog open={isDeleteTeamOpen} onOpenChange={setIsDeleteTeamOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa nhóm</DialogTitle>
              <DialogDescription>
                Hành động này sẽ xóa toàn bộ nhóm và tất cả dữ liệu liên quan
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Bạn có chắc chắn muốn xóa nhóm <strong>{currentTeam?.name}</strong>?
                Tất cả dữ liệu nhóm sẽ bị xóa vĩnh viễn và không thể hoàn tác.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteTeamOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteTeam}>
                Xóa nhóm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 