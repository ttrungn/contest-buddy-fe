import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/services/store/store";
import { fetchCustomerProfile } from "@/services/features/users/userSlice";
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
import { Users, User, Plus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/services/constant/axiosInstance";
import { 
  USER_TEAMS_ENDPOINT, 
  TEAM_MEMBERS_ENDPOINT, 
  COMPETITION_REGISTER_ENDPOINT 
} from "@/services/constant/apiConfig";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitionId: string;
  competitionTitle: string;
  isRegisteredAsTeam: boolean;
  maxParticipantsPerTeam?: number;
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
  avatarUrl?: string;
  city?: string;
  region?: string;
}

interface UserTeam {
  id: string;
  name: string;
  avatar?: string;
  members: number;
  maxMembers: number;
  leader: string;
  description?: string;
}

interface TeamMemberResponse {
  _id: string;
  id: string;
  team_id: string;
  role: string;
  joined_at: string;
  status: string;
  __v: number;
  user: {
    _id: string;
    id: string;
    username: string;
    password: string;
    full_name: string;
    email: string;
    bio: string;
    school: string;
    city: string;
    region: string;
    country: string;
    study_field: string;
    join_date: string;
    is_verified: boolean;
    verification_token: string;
    verification_token_expires: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    refresh_token: string;
    avatar_url?: string;
  };
}

interface UserTeamResponse {
  _id: string;
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  leader_id: string;
  competition_id: string;
  max_members: number;
  created_at: string;
  updated_at: string;
  status: string;
  __v: number;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  competitionId,
  competitionTitle,
  isRegisteredAsTeam,
  maxParticipantsPerTeam,
}: RegistrationModalProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [userTeams, setUserTeams] = useState<UserTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  // Get user profile from Redux store
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const isUserLoading = useSelector((state: RootState) => state.user.isLoading);
  const dispatch = useDispatch<AppDispatch>();

  // Determine registration type based on competition setting
  const registrationType = isRegisteredAsTeam ? "team" : "individual";

  // Fetch user's teams when component mounts for team registration
  // Also fetch user profile if not available for individual registration
  useEffect(() => {
    if (isOpen) {
      // Fetch user profile if not available and individual registration is selected
      if (registrationType === "individual" && !userProfile) {
        dispatch(fetchCustomerProfile());
      }
      
      // Fetch teams for team registration
      if (registrationType === "team") {
        fetchUserTeams();
      }
    }
  }, [isOpen, isRegisteredAsTeam, userProfile, dispatch]);

  // Fetch team members when a team is selected
  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam);
    } else {
      setTeamMembers([]);
    }
  }, [selectedTeam]);

  const fetchUserTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const response = await api.get(USER_TEAMS_ENDPOINT);
      
      if (response.success && response.data) {
        // Fetch team details including member counts
        const teamPromises = response.data.map(async (team: UserTeamResponse) => {
          try {
            // Fetch members count for each team
            const membersResponse = await api.get(TEAM_MEMBERS_ENDPOINT(team.id));
            const memberCount = membersResponse.success ? membersResponse.data.length : 0;
            
            // Find leader name from the included user data
            let leaderName = "Unknown";
            if (membersResponse.success && membersResponse.data) {
              const leader = membersResponse.data.find((member: TeamMemberResponse) => member.role === "leader");
              if (leader && leader.user) {
                leaderName = leader.user.full_name || "Unknown";
              }
            }
            
            return {
              id: team.id,
              name: team.name,
              avatar: team.avatar_url,
              members: memberCount,
              maxMembers: team.max_members,
              leader: leaderName,
              description: team.description,
            };
          } catch (teamError) {
            console.error("Error fetching team details:", teamError);
            return {
              id: team.id,
              name: team.name,
              avatar: team.avatar_url,
              members: 0,
              maxMembers: team.max_members,
              leader: "Unknown",
              description: team.description,
            };
          }
        });

        const teams: UserTeam[] = await Promise.all(teamPromises);
        setUserTeams(teams);
      }
    } catch (error) {
      console.error("Error fetching user teams:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhóm. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    setIsLoadingMembers(true);
    try {
      const response = await api.get(TEAM_MEMBERS_ENDPOINT(teamId));
      
      if (response.success && response.data) {
        // Map the response data directly since user details are included
        const members: TeamMember[] = response.data.map((member: TeamMemberResponse) => {
          const userData = member.user;
          
          return {
            id: userData.id,
            fullName: userData.full_name || "Chưa cập nhật",
            email: userData.email || "Chưa cập nhật",
            phone: "Chưa cung cấp", // Phone not available in this response
            school: userData.school || "Chưa cung cấp",
            studentId: "Chưa cung cấp", // Student ID not available in this response
            role: member.role,
            skills: [], // Skills not available in this response
            avatarUrl: userData.avatar_url,
            city: userData.city || "Chưa cập nhật",
            region: userData.region || "Chưa cập nhật",
          };
        });

        setTeamMembers(members);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin thành viên nhóm. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleRegister = async () => {
    if (!agreedToTerms) {
      alert("Vui lòng đồng ý với điều khoản đăng ký");
      return;
    }

    // Validate team selection for team registration
    if (registrationType === "team" && !selectedTeam) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nhóm để đăng ký.",
        variant: "destructive"
      });
      return;
    }

    // Validate team size doesn't exceed competition limit
    if (registrationType === "team" && selectedTeam && maxParticipantsPerTeam) {
      const selectedTeamData = userTeams.find(team => team.id === selectedTeam);
      if (selectedTeamData && selectedTeamData.members > maxParticipantsPerTeam) {
        toast({
          title: "Lỗi",
          description: `Nhóm được chọn có ${selectedTeamData.members} thành viên, vượt quá giới hạn ${maxParticipantsPerTeam} thành viên tối đa.`,
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      // Prepare request body
      const requestBody: { teamId?: string } = {};
      
      // Add teamId only for team registration
      if (registrationType === "team" && selectedTeam) {
        requestBody.teamId = selectedTeam;
      }

      // Make API call to register for competition
      const response = await api.post(
        COMPETITION_REGISTER_ENDPOINT(competitionId),
        requestBody
      );

      if (response.success) {
        toast({
          title: "Đăng ký thành công!",
          description: `Bạn đã đăng ký tham gia cuộc thi thành công.`,
          variant: "default"
        });
        onClose();
      } else {
        throw new Error(response.message || "Đăng ký thất bại");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Đăng ký thất bại",
        description: error.response?.data?.message || error.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
          {/* Registration Type Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              {isRegisteredAsTeam ? (
                <>
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Đăng ký theo nhóm</div>
                    <div className="text-sm text-muted-foreground">Cuộc thi này yêu cầu tham gia theo nhóm</div>
                  </div>
                </>
              ) : (
                <>
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Đăng ký cá nhân</div>
                    <div className="text-sm text-muted-foreground">Cuộc thi này cho phép tham gia cá nhân</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {registrationType === "team" && (
            <>
              {/* Team Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Chọn nhóm</Label>
                
                {/* User's Teams */}
                {isLoadingTeams ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Đang tải danh sách nhóm...</span>
                  </div>
                ) : userTeams.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Nhóm của bạn</div>
                    {userTeams.map((team) => {
                      // Check if team exceeds max participants per team limit
                      const exceedsLimit = maxParticipantsPerTeam && team.members > maxParticipantsPerTeam;
                      
                      return (
                        <Card 
                          key={team.id}
                          className={cn(
                            "transition-all",
                            exceedsLimit 
                              ? "cursor-not-allowed opacity-60 bg-muted" 
                              : "cursor-pointer",
                            selectedTeam === team.id && !exceedsLimit && "ring-2 ring-primary"
                          )}
                          onClick={() => {
                            if (!exceedsLimit) {
                              setSelectedTeam(team.id);
                            }
                          }}
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
                                    {team.members}/{team.maxMembers} thành viên
                                  </div>
                                  {exceedsLimit && (
                                    <div className="text-xs text-destructive mt-1">
                                      Vượt quá giới hạn ({maxParticipantsPerTeam} thành viên tối đa)
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{team.leader}</Badge>
                                {exceedsLimit && (
                                  <AlertCircle className="h-5 w-5 text-destructive" />
                                )}
                                {selectedTeam === team.id && !exceedsLimit && (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Bạn chưa có nhóm nào</p>
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
              {selectedTeam && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Thông tin thành viên</Label>
                  {isLoadingMembers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Đang tải thông tin thành viên...</span>
                    </div>
                  ) : teamMembers.length > 0 ? (
                    <div className="space-y-4">
                      {teamMembers.map((member, index) => (
                        <Card key={member.id}>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.avatarUrl} alt={member.fullName} />
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
                              <div>
                                <Label htmlFor={`city-${index}`}>Thành phố</Label>
                                <Input 
                                  id={`city-${index}`}
                                  value={member.city || "Chưa cập nhật"}
                                  readOnly
                                  className="bg-muted/50"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`region-${index}`}>Khu vực</Label>
                                <Input 
                                  id={`region-${index}`}
                                  value={member.region || "Chưa cập nhật"}
                                  readOnly
                                  className="bg-muted/50"
                                />
                              </div>
                            </div>
                            {member.skills && member.skills.length > 0 && (
                              <div>
                                <Label>Kỹ năng</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {member.skills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Không có thông tin thành viên</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {registrationType === "individual" && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Thông tin cá nhân</Label>
              {isUserLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Đang tải thông tin cá nhân...</span>
                </div>
              ) : userProfile ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userProfile?.avatar_url || userProfile?.avatarUrl} alt={userProfile?.full_name || "User"} />
                        <AvatarFallback>{userProfile?.full_name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{userProfile?.full_name || "Chưa cập nhật"}</div>
                        <div className="text-sm text-muted-foreground">{userProfile?.school || "Chưa cập nhật"}</div>
                        {/* Note: is_verified is not available in CustomerProfile interface, removing for now */}
                      </div>
                      {userProfile?.rating && userProfile.rating > 0 && (
                        <Badge variant="outline" className="text-xs">
                          ⭐ {userProfile.rating}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <Input value={userProfile?.email || "Chưa cập nhật"} readOnly className="bg-muted/50" />
                      </div>
                      <div>
                        <Label>Số điện thoại</Label>
                        <Input value="Chưa cập nhật" readOnly className="bg-muted/50" />
                      </div>
                      <div>
                        <Label>Mã sinh viên</Label>
                        <Input value="Chưa cập nhật" readOnly className="bg-muted/50" />
                      </div>
                      <div>
                        <Label>Chuyên ngành</Label>
                        <Input value={userProfile?.study_field || "Chưa cập nhật"} readOnly className="bg-muted/50" />
                      </div>
                      {userProfile?.city && (
                        <div>
                          <Label>Thành phố</Label>
                          <Input value={userProfile.city} readOnly className="bg-muted/50" />
                        </div>
                      )}
                      {userProfile?.region && (
                        <div>
                          <Label>Khu vực</Label>
                          <Input value={userProfile.region} readOnly className="bg-muted/50" />
                        </div>
                      )}
                    </div>
                    {userProfile?.bio && (
                      <div className="mt-4">
                        <Label>Giới thiệu</Label>
                        <Textarea 
                          value={userProfile.bio} 
                          readOnly 
                          className="bg-muted/50 mt-2"
                          rows={3}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Không thể tải thông tin cá nhân</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => dispatch(fetchCustomerProfile())}
                  >
                    Thử lại
                  </Button>
                </div>
              )}
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