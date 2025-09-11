import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  mockTeams,
  mockTeamInvitations,
  mockCompetitions,
} from "@/lib/mockData";
import { Team, TeamInvitation } from "@/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const [teams, setTeams] = useState(mockTeams);
  const [invitations, setInvitations] = useState(mockTeamInvitations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("my-teams");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const currentUserId = "1"; // Mock current user
  const navigate = useNavigate();

  const myTeams = teams.filter((team) =>
    team.members.some((member) => member.userId === currentUserId),
  );

  const myInvitations = invitations.filter(
    (inv) => inv.inviteeId === currentUserId && inv.status === "pending",
  );

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const formatDate = (date: Date) => {
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

  const handleAcceptInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "accepted" } : inv,
      ),
    );
  };

  const handleRejectInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "rejected" } : inv,
      ),
    );
  };

  const TeamCard = ({ team }: { team: Team }) => {
    const isMyTeam = team.members.some(
      (member) => member.userId === currentUserId,
    );
    const myRole = team.members.find(
      (member) => member.userId === currentUserId,
    )?.role;

    return (
      <Card className="card-hover cursor-pointer" onClick={() => navigate(`/teams/${team.id}`)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 w-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src={team.avatar} alt={team.name} />
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
                  {isMyTeam && myRole === "leader" && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2 text-left">
                  {team.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground text-left">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {team.members.length}/{team.maxMembers} thành viên
                  </div>
                  {team.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {team.location} {team.isRemote && "(Remote)"}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(team.createdAt)}
                  </div>
                </div>
              </div>
            </div>
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
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nhắn tin nhóm
                </DropdownMenuItem>
                {isMyTeam && myRole === "leader" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Cài đặt nhóm
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Giải tán nhóm
                    </DropdownMenuItem>
                  </>
                )}
                {!isMyTeam && (
                  <DropdownMenuItem>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Xin tham gia
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-left">
          {team.competitionTitle && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">
                  {team.competitionTitle}
                </span>
              </div>
            </div>
          )}

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Thành viên</span>
              {isMyTeam && myRole === "leader" && (
                <Button variant="outline" size="sm">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Mời thêm
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {team.members.slice(0, 6).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-2 bg-muted rounded-full px-3 py-1"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={member.user.avatar}
                      alt={member.user.fullName}
                    />
                    <AvatarFallback className="text-xs">
                      {member.user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">
                    {member.user.fullName}
                  </span>
                  {member.role === "leader" && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              ))}
              {team.members.length > 6 && (
                <div className="flex items-center justify-center bg-muted rounded-full px-3 py-1">
                  <span className="text-xs text-muted-foreground">
                    +{team.members.length - 6}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Kỹ năng nhóm</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {team.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {team.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{team.skills.length - 5}
                </Badge>
              )}
            </div>
          </div>

          {/* Goals */}
          {team.goals.length > 0 && (
            <div>
              <span className="text-sm font-medium mb-2 block">Mục tiêu:</span>
              <div className="space-y-1">
                {team.goals.slice(0, 2).map((goal, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    • {goal}
                  </div>
                ))}
                {team.goals.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{team.goals.length - 2} mục tiêu khác
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                Mã mời: {team.inviteCode}
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex space-x-2">
              {!isMyTeam ? (
                <>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Nhắn tin
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Xin tham gia
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CreateTeamDialog = () => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      competitionId: "",
      maxMembers: 4,
      skills: [] as string[],
      goals: [] as string[],
      location: "",
      isRemote: false,
      isPrivate: false,
    });

    return (
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo nhóm mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamName">Tên nhóm *</Label>
              <Input
                id="teamName"
                placeholder="VD: CodeMasters, Design Innovators..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả nhóm *</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về nhóm, mục tiêu, kinh nghiệm..."
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="competition">Cuộc thi mục tiêu (tùy chọn)</Label>
              <Select
                value={formData.competitionId}
                onValueChange={(value) =>
                  setFormData({ ...formData, competitionId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cuộc thi" />
                </SelectTrigger>
                <SelectContent>
                  {mockCompetitions.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>
                      {comp.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxMembers">Số thành viên tối đa</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  min="2"
                  max="10"
                  value={formData.maxMembers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxMembers: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  placeholder="VD: Hà Nội, TP.HCM..."
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateTeamOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={() => setIsCreateTeamOpen(false)}>
                Tạo nhóm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
            <CreateTeamDialog />
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhóm theo tên, mô tả, kỹ năng..."
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
              Nhóm của tôi ({myTeams.length})
            </TabsTrigger>
            <TabsTrigger value="invitations">
              Lời mời ({myInvitations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-teams" className="space-y-6 mt-6">
            {myTeams.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Bạn chưa có nhóm nào
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
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Không có lời mời nào
                  </h3>
                  <p className="text-muted-foreground">
                    Các lời mời tham gia nhóm sẽ xuất hiện ở đây
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myInvitations.map((invitation) => (
                  <Card key={invitation.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={invitation.team.avatar}
                            alt={invitation.team.name}
                          />
                          <AvatarFallback>
                            {invitation.team.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-left">
                              {invitation.team.name}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              • {formatDate(invitation.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 text-left">
                            <span className="font-medium">
                              {invitation.inviter.fullName}
                            </span>{" "}
                            đã mời bạn tham gia nhóm
                          </p>
                          <p className="text-sm mb-4 text-left">{invitation.message}</p>
                          <div className="flex gap-2 justify-start">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAcceptInvitation(invitation.id)
                              }
                            >
                              Chấp nhận
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRejectInvitation(invitation.id)
                              }
                            >
                              Từ chối
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
