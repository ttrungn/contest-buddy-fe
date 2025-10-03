import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  MessageSquare,
  UserPlus,
  Star,
  CheckCircle,
  MapPin,
  School,
  Calendar,
  Trophy,
  Target,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  Users,
  Clock,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { mockUsers } from "@/lib/mockData";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { api } from "@/services/constant/axiosInstance";
import { CUSTOMER_DETAIL_ENDPOINT } from "@/services/constant/apiConfig";

interface CustomerSkill {
  skill_name: string;
  category: string;
  level: string;
  experience_years: number;
}

interface CustomerAchievement {
  id: string;
  competition_name: string;
  position: number;
  award: string;
  achieved_at: string;
  category: string;
  description: string;
}

interface CustomerProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  created_at: string;
}

interface CustomerProfile {
  userId: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  school: string;
  city: string;
  region: string;
  country: string;
  study_field: string;
  join_date: string;
  rating: number;
  is_verified: boolean;
  skills: CustomerSkill[];
  achievements: CustomerAchievement[];
  projects: CustomerProject[];
  social_links: {
    github: string;
    linkedin: string;
    personal: string;
  };
}

interface ApiResponse {
  success: boolean;
  profile: CustomerProfile;
}

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const { toast } = useToast();
  const { openChatWithUser } = useChat();

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get(CUSTOMER_DETAIL_ENDPOINT(id));
        
        if (response.success && response.profile) {
          setUserProfile(response.profile);
        } else {
          setError("Không thể tải thông tin người dùng");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Có lỗi xảy ra khi tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
            <p className="text-muted-foreground">
              Đang tải thông tin người dùng.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h1>
            <p className="text-muted-foreground mb-6">
              {error || "Thí sinh này không tồn tại hoặc đã bị xóa."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-blue-100 text-blue-700";
      case "advanced":
        return "bg-purple-100 text-purple-700";
      case "expert":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSkillLevelProgress = (level: string) => {
    switch (level) {
      case "beginner":
        return 25;
      case "intermediate":
        return 50;
      case "advanced":
        return 75;
      case "expert":
        return 100;
      default:
        return 0;
    }
  };

  const handleInvite = () => {
    if (!userProfile) return;
    
    setIsInviting(true);
    
    // Mock API call
    setTimeout(() => {
      setIsInviting(false);
      toast({
        title: "Gửi lời mời thành công!",
        description: `Đã gửi lời mời đến ${userProfile.full_name}. Họ sẽ nhận được thông báo.`,
      });
    }, 1000);
  };

  const handleMessage = () => {
    if (!userProfile) return;
    
    setIsMessaging(true);
    
    // Open chat with user
    setTimeout(() => {
      setIsMessaging(false);
      openChatWithUser(userProfile.userId, userProfile.full_name);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
              <AvatarFallback className="text-2xl">
                {userProfile.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{userProfile.full_name}</h1>
                {userProfile.is_verified && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(userProfile.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                  <span className="text-lg text-muted-foreground ml-2">
                    ({userProfile.rating})
                  </span>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground mb-3">
                @{userProfile.username}
              </p>
              
              <div className="flex items-center space-x-6 text-muted-foreground mb-4">
                <div className="flex items-center">
                  <School className="h-5 w-5 mr-2" />
                  {userProfile.school}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {userProfile.city}, {userProfile.region}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Tham gia từ {formatJoinDate(userProfile.join_date)}
                </div>
              </div>
              
              <p className="text-lg mb-6">{userProfile.bio || "Chưa có thông tin giới thiệu"}</p>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleInvite}
                  disabled={isInviting}
                  className="flex-1"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isInviting ? "Đang mời..." : "Mời vào nhóm"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMessage}
                  disabled={isMessaging}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isMessaging ? "Đang gửi..." : "Nhắn tin"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
            <TabsTrigger value="achievements">Thành tích</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Thông tin cơ bản */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Thông tin cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Chuyên ngành
                    </label>
                    <p className="text-lg">{userProfile.study_field}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-lg flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {userProfile.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                    <p className="text-lg flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      @{userProfile.username}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Địa chỉ
                    </label>
                    <p className="text-lg flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {userProfile.city}, {userProfile.region}, {userProfile.country}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Ngày tham gia
                    </label>
                    <p className="text-lg flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatJoinDate(userProfile.join_date)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sở thích - sẽ hiển thị thông báo chưa có dữ liệu */}
              <Card>
                <CardHeader>
                  <CardTitle>Quan tâm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Chưa có thông tin về sở thích
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Lịch sử cộng tác - sẽ hiển thị thông báo chưa có dữ liệu */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Lịch sử cộng tác
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Chưa có lịch sử cộng tác
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            {Object.values(userProfile.social_links).some(link => link) && (
              <Card>
                <CardHeader>
                  <CardTitle>Liên kết mạng xã hội</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    {userProfile.social_links.github && (
                      <Button variant="outline" asChild>
                        <a href={userProfile.social_links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {userProfile.social_links.linkedin && (
                      <Button variant="outline" asChild>
                        <a href={userProfile.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {userProfile.social_links.personal && (
                      <Button variant="outline" asChild>
                        <a href={userProfile.social_links.personal} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Kỹ năng chuyên môn
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile.skills && userProfile.skills.length > 0 ? (
                  <div className="space-y-6">
                    {userProfile.skills.map((skill) => (
                      <div key={skill.skill_name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{skill.skill_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {skill.experience_years} năm kinh nghiệm • {skill.category}
                            </p>
                          </div>
                          <Badge className={getSkillLevelColor(skill.level)}>
                            {skill.level}
                          </Badge>
                        </div>
                        <Progress value={getSkillLevelProgress(skill.level)} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có thông tin kỹ năng</h3>
                    <p className="text-muted-foreground">
                      Thí sinh này chưa cập nhật thông tin về kỹ năng chuyên môn.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Thành tích nổi bật
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile.achievements && userProfile.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {userProfile.achievements.map((achievement) => (
                      <div key={achievement.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{achievement.competition_name}</h4>
                            <p className="text-muted-foreground mb-2">{achievement.category}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center">
                                <Award className="h-4 w-4 mr-1 text-yellow-500" />
                                {achievement.award}
                              </div>
                              <div className="flex items-center">
                                <Trophy className="h-4 w-4 mr-1 text-blue-500" />
                                Hạng {achievement.position}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(new Date(achievement.achieved_at))}
                              </div>
                            </div>
                            {achievement.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {achievement.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có thành tích</h3>
                    <p className="text-muted-foreground">
                      Thí sinh này chưa có thành tích nào được ghi nhận.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile.projects && userProfile.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userProfile.projects.map((item) => {
                      // Parse tags if they're in JSON format
                      let parsedTags: string[] = [];
                      try {
                        if (item.tags && item.tags.length > 0) {
                          parsedTags = JSON.parse(item.tags[0]) || [];
                        }
                      } catch (e) {
                        // If parsing fails, use tags as is
                        parsedTags = item.tags || [];
                      }

                      return (
                        <div key={item.id} className="border rounded-lg overflow-hidden">
                          {item.image_url && (
                            <div className="aspect-video bg-muted">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h4 className="font-medium mb-2">{item.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {item.description}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">
                              <strong>Danh mục:</strong> {item.category}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {parsedTags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                              <span>{formatDate(new Date(item.created_at))}</span>
                            </div>
                            <div className="flex space-x-2">
                              {item.project_url && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Xem dự án
                                  </a>
                                </Button>
                              )}
                              {item.github_url && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={item.github_url} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4 mr-1" />
                                    GitHub
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có portfolio</h3>
                    <p className="text-muted-foreground">
                      Thí sinh này chưa chia sẻ bất kỳ dự án nào.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 