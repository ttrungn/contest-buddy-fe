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

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const { toast } = useToast();
  const { openChatWithUser } = useChat();

  useEffect(() => {
    if (id) {
      const foundUser = mockUsers.find((u) => u.id === id);
      setUser(foundUser || null);
    }
  }, [id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h1>
            <p className="text-muted-foreground mb-6">
              Thí sinh này không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatJoinDate = (date: Date) => {
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
    if (!user) return;
    
    setIsInviting(true);
    
    // Mock API call
    setTimeout(() => {
      setIsInviting(false);
      toast({
        title: "Gửi lời mời thành công!",
        description: `Đã gửi lời mời đến ${user.fullName}. Họ sẽ nhận được thông báo.`,
      });
    }, 1000);
  };

  const handleMessage = () => {
    if (!user) return;
    
    setIsMessaging(true);
    
    // Open chat with user
    setTimeout(() => {
      setIsMessaging(false);
      openChatWithUser(user.id, user.fullName);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="text-2xl">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{user.fullName}</h1>
                {user.isVerified && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(user.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                  <span className="text-lg text-muted-foreground ml-2">
                    ({user.rating})
                  </span>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground mb-3">
                @{user.username}
              </p>
              
              <div className="flex items-center space-x-6 text-muted-foreground mb-4">
                <div className="flex items-center">
                  <School className="h-5 w-5 mr-2" />
                  {user.school}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {user.location.city}, {user.location.region}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Tham gia từ {formatJoinDate(user.joinDate)}
                </div>
              </div>
              
              <p className="text-lg mb-6">{user.bio}</p>
              
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
                    <p className="text-lg">{user.studyField}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-lg flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Địa chỉ
                    </label>
                    <p className="text-lg flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.location.city}, {user.location.region}, {user.location.country}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Ngày tham gia
                    </label>
                    <p className="text-lg flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatJoinDate(user.joinDate)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sở thích */}
              <Card>
                <CardHeader>
                  <CardTitle>Quan tâm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lịch sử cộng tác */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Lịch sử cộng tác
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.collaborationHistory.length > 0 ? (
                    <div className="space-y-3">
                      {user.collaborationHistory.slice(0, 3).map((collab) => (
                        <div key={collab.id} className="border-l-2 border-primary pl-3">
                          <p className="font-medium">{collab.competitionTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            Cùng {collab.partnerName}
                          </p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < collab.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300",
                                )}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({collab.rating})
                            </span>
                          </div>
                        </div>
                      ))}
                      {user.collaborationHistory.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{user.collaborationHistory.length - 3} lần cộng tác khác
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Chưa có lịch sử cộng tác
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            {Object.values(user.socialLinks).some(link => link) && (
              <Card>
                <CardHeader>
                  <CardTitle>Liên kết mạng xã hội</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    {user.socialLinks.github && (
                      <Button variant="outline" asChild>
                        <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {user.socialLinks.linkedin && (
                      <Button variant="outline" asChild>
                        <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {user.socialLinks.personal && (
                      <Button variant="outline" asChild>
                        <a href={user.socialLinks.personal} target="_blank" rel="noopener noreferrer">
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
                <div className="space-y-6">
                  {user.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{skill.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {skill.experienceYears} năm kinh nghiệm
                          </p>
                        </div>
                        <Badge className={getSkillLevelColor(skill.level)}>
                          {skill.level}
                        </Badge>
                      </div>
                      <Progress value={getSkillLevelProgress(skill.level)} className="h-2" />
                      
                      {skill.certifications && skill.certifications.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Chứng chỉ:</p>
                          <div className="space-y-2">
                            {skill.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{cert.name} - {cert.issuer}</span>
                                <span className="text-muted-foreground">
                                  {formatDate(cert.date)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                {user.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {user.achievements.map((achievement) => (
                      <div key={achievement.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{achievement.competitionTitle}</h4>
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
                                {formatDate(achievement.date)}
                              </div>
                              {achievement.teamSize && (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  Đội {achievement.teamSize} người
                                </div>
                              )}
                            </div>
                            {achievement.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {achievement.description}
                              </p>
                            )}
                          </div>
                          {achievement.certificate && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={achievement.certificate} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Chứng chỉ
                              </a>
                            </Button>
                          )}
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
                {user.portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.portfolio.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        {item.imageUrl && (
                          <div className="aspect-video bg-muted">
                            <img
                              src={item.imageUrl}
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
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{formatDate(item.date)}</span>
                            {item.featured && (
                              <Badge variant="secondary" className="text-xs">
                                Nổi bật
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-2 mt-3">
                            {item.projectUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Xem dự án
                                </a>
                              </Button>
                            )}
                            {item.githubUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4 mr-1" />
                                  GitHub
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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