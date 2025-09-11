import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Users, User, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { mockTeams, mockUsers } from "@/lib/mockData";
import { Team, User as UserType } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitionId: string;
  competitionTitle: string;
}

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  studentId: string;
  role: string;
  skills: string[];
}

export default function RegistrationModal({
  isOpen,
  onClose,
  competitionId,
  competitionTitle,
}: RegistrationModalProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [registrationType, setRegistrationType] = useState<"individual" | "team">("team");
  const { toast } = useToast();

  // Mock current user (in real app, this would come from auth context)
  const currentUser = mockUsers[0];

  // Get available teams for this competition
  const availableTeams = mockTeams.filter(team => 
    team.competitionId === competitionId && team.status === "active"
  );

  // Get user's own teams that are not registered to any competition
  const userTeams = mockTeams.filter(team => 
    team.members.some(member => member.userId === currentUser.id) &&
    !team.competitionId // chỉ lấy nhóm chưa đăng ký cuộc thi nào
  );

  useEffect(() => {
    if (selectedTeam) {
      const team = mockTeams.find(t => t.id === selectedTeam);
      if (team) {
        // Auto-fill team member information
        const members: TeamMember[] = team.members.map(member => ({
          id: member.userId,
          fullName: member.user.fullName,
          email: `${member.user.username}@example.com`, // Mock email
          phone: "0123456789", // Mock phone
          school: member.user.school,
          studentId: `SV${member.userId}`, // Mock student ID
          role: member.role,
          skills: member.user.skills,
        }));
        setTeamMembers(members);
      }
    } else {
      setTeamMembers([]);
    }
  }, [selectedTeam]);

  const handleRegister = async () => {
    if (!agreedToTerms) {
      alert("Vui lòng đồng ý với điều khoản đăng ký");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    toast({
      title: "Đăng ký thành công!",
      description: `Bạn đã đăng ký tham gia cuộc thi thành công.`,
      variant: "default"
    });
    onClose();
  };

  const handleCreateNewTeam = () => {
    // Navigate to team management page
    window.location.href = "/teams";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Đăng ký tham gia cuộc thi
          </DialogTitle>
          <DialogDescription>
            {competitionTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Registration Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Hình thức đăng ký</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  registrationType === "individual" && "ring-2 ring-primary"
                )}
                onClick={() => setRegistrationType("individual")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Cá nhân</div>
                      <div className="text-sm text-muted-foreground">Tham gia một mình</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  registrationType === "team" && "ring-2 ring-primary"
                )}
                onClick={() => setRegistrationType("team")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Nhóm</div>
                      <div className="text-sm text-muted-foreground">Tham gia theo nhóm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {registrationType === "team" && (
            <>
              {/* Team Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Chọn nhóm</Label>
                
                {/* User's Teams */}
                {userTeams.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Nhóm của bạn</div>
                    {userTeams.map((team) => (
                      <Card 
                        key={team.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          selectedTeam === team.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedTeam(team.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={team.avatar} alt={team.name} />
                                <AvatarFallback>{team.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{team.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {team.members.length}/{team.maxMembers} thành viên
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{team.leader.user.fullName}</Badge>
                              {selectedTeam === team.id && (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Create New Team */}
                <Card className="cursor-pointer transition-all hover:bg-muted/50" onClick={handleCreateNewTeam}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Tạo nhóm mới</div>
                        <div className="text-sm text-muted-foreground">Tạo nhóm mới cho cuộc thi này</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Members Information */}
              {selectedTeam && teamMembers.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Thông tin thành viên</Label>
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <Card key={member.id}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/api/placeholder/150/150`} alt={member.fullName} />
                              <AvatarFallback>{member.fullName[0]}</AvatarFallback>
                            </Avatar>
                            <span>{member.fullName}</span>
                            <Badge variant={member.role === "leader" ? "default" : "secondary"}>
                              {member.role === "leader" ? "Trưởng nhóm" : "Thành viên"}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`email-${index}`}>Email</Label>
                              <Input 
                                id={`email-${index}`}
                                value={member.email}
                                readOnly
                                className="bg-muted/50"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`phone-${index}`}>Số điện thoại</Label>
                              <Input 
                                id={`phone-${index}`}
                                value={member.phone}
                                readOnly
                                className="bg-muted/50"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`school-${index}`}>Trường học</Label>
                              <Input 
                                id={`school-${index}`}
                                value={member.school}
                                readOnly
                                className="bg-muted/50"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`studentId-${index}`}>Mã sinh viên</Label>
                              <Input 
                                id={`studentId-${index}`}
                                value={member.studentId}
                                readOnly
                                className="bg-muted/50"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Kỹ năng</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {member.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {registrationType === "individual" && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Thông tin cá nhân</Label>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.fullName} />
                      <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{currentUser.fullName}</div>
                      <div className="text-sm text-muted-foreground">{currentUser.school}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input value={`${currentUser.username}@example.com`} readOnly className="bg-muted/50" />
                    </div>
                    <div>
                      <Label>Số điện thoại</Label>
                      <Input value="0123456789" readOnly className="bg-muted/50" />
                    </div>
                    <div>
                      <Label>Mã sinh viên</Label>
                      <Input value={`SV${currentUser.id}`} readOnly className="bg-muted/50" />
                    </div>
                    <div>
                      <Label>Chuyên ngành</Label>
                      <Input value={currentUser.studyField} readOnly className="bg-muted/50" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tôi đồng ý với điều khoản và điều kiện đăng ký
                </Label>
                <p className="text-sm text-muted-foreground">
                  Bằng việc đăng ký, tôi cam kết tuân thủ các quy định của cuộc thi và chịu trách nhiệm về thông tin đã cung cấp.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-orange-800 mb-1">Lưu ý quan trọng:</div>
                  <ul className="text-orange-700 space-y-1">
                    <li>• Thông tin đăng ký sẽ được sử dụng để liên lạc và xác minh</li>
                    <li>• Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                    <li>• Sau khi đăng ký, bạn sẽ nhận được email xác nhận</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleRegister}
            disabled={!agreedToTerms || isLoading || (registrationType === "team" && !selectedTeam)}
            className="min-w-[120px]"
          >
            {isLoading ? "Đang đăng ký..." : "Xác nhận đăng ký"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 