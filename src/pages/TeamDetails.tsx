import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockTeams, mockUsers } from "@/lib/mockData";
import { Team, TeamMember } from "@/types";

export default function TeamDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Lấy dữ liệu nhóm từ mockTeams
  const team: Team | undefined = mockTeams.find((t) => t.id === id);

  if (!team) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy nhóm</h1>
          <Button onClick={() => navigate("/teams")}>Quay lại danh sách nhóm</Button>
        </div>
      </div>
    );
  }

  // Lấy thông tin leader và các thành viên
  const leader = team.leader;
  const members = team.members;

  // Xử lý mở dialog chỉnh sửa
  const handleEdit = (member: TeamMember) => {
    setEditMember(member);
    setEditData({
      fullName: member.user.fullName,
      school: member.user.school,
      skills: member.user.skills.join(", "),
    });
  };

  // Xử lý lưu chỉnh sửa
  const handleSave = () => {
    // Ở đây chỉ cập nhật local state, thực tế sẽ gọi API
    if (editMember) {
      editMember.user.fullName = editData.fullName;
      editMember.user.school = editData.school;
      editMember.user.skills = editData.skills.split(",").map((s: string) => s.trim());
    }
    setEditMember(null);
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
              <AvatarImage src={team.avatar} alt={team.name} />
              <AvatarFallback>{team.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                {team.name}
                {team.status === "recruiting" && (
                  <Badge variant="secondary">Đang tuyển</Badge>
                )}
              </h1>
              <p className="text-muted-foreground mb-2">{team.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Leader: <span className="font-medium ml-1">{leader.user.fullName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {team.members.length + 1} thành viên
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
              {/* Leader */}
              <div className="border rounded-lg p-4 bg-primary/5">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={leader.user.avatar} alt={leader.user.fullName} />
                    <AvatarFallback>{leader.user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold flex items-center gap-1">
                      {leader.user.fullName}
                      <Crown className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="text-xs text-muted-foreground">{leader.user.school}</div>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs font-medium">Kỹ năng:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {leader.user.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">Leader</Badge>
              </div>

              {/* Các thành viên khác */}
              {members.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.user.avatar} alt={member.user.fullName} />
                      <AvatarFallback>{member.user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        {member.user.fullName}
                        {member.status === "active" && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{member.user.school}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-medium">Kỹ năng:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.user.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                    <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa
                  </Button>
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
      </div>
    </div>
  );
} 