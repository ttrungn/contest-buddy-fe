import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ExternalLink,
  Share,
  Heart,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockCompetitions, mockUsers, mockTeams } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useUserRole } from "@/contexts/UserRoleContext";
import RegistrationModal from "@/components/RegistrationModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, UserPlus, Flag } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import CompetitionThumbnail from "@/components/CompetitionThumbnail";

export default function Competition() {
  const { id } = useParams();
  const competition = mockCompetitions.find((comp) => comp.id === id);
  const { isAdmin } = useUserRole();
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { openChatWithUser } = useChat();
  const [isInterested, setIsInterested] = useState(false);

  // Mock current user (in real app, this would come from auth context)
  const currentUser = mockUsers[0];

  // Mock user registrations (in real app, this would come from API)
  const userRegistrations = [
    { competitionId: "2", teamId: "1", registeredAt: new Date("2024-01-15") }, // User đã đăng ký cuộc thi ACM ICPC
  ];

  // Check if current user is already registered for this competition
  const isUserRegistered = userRegistrations.some(reg => reg.competitionId === id);
  const userRegistration = userRegistrations.find(reg => reg.competitionId === id);

  // Check if user is in any team
  const userTeams = mockTeams.filter(team => team.members.some(m => m.userId === currentUser.id));
  const hasTeam = userTeams.length > 0;

  const handleInviteUser = (user: any) => {
    // Mock API call
    setTimeout(() => {
      toast({
        title: "Gửi lời mời thành công!",
        description: `Đã gửi lời mời đến ${user.fullName}. Họ sẽ nhận được thông báo.`,
      });
    }, 1000);
  };

  const handleChatWithUser = (user: any) => {
    openChatWithUser(user.id, user.fullName);
  };

  if (!competition) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy cuộc thi</h1>
          <p className="text-muted-foreground">
            Cuộc thi bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (competition.status) {
      case "registration-open":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Đang mở đăng ký
          </Badge>
        );
      case "upcoming":
        return <Badge variant="secondary">Sắp diễn ra</Badge>;
      case "ongoing":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return <Badge variant="outline">Đã kết thúc</Badge>;
      default:
        return null;
    }
  };

  const getCategoryIcon = () => {
    const iconMap: Record<string, string> = {
      programming: "💻",
      design: "🎨",
      business: "💼",
      science: "🔬",
      mathematics: "📐",
      innovation: "💡",
      startup: "🚀",
      creative: "✨",
    };
    return iconMap[competition.category] || "🏆";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const getDaysUntilDeadline = () => {
    const today = new Date();
    const deadline = new Date(competition.registrationDeadline);
    
    // Reset time to start of day for accurate comparison
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const deadlineStart = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    
    const diffTime = deadlineStart.getTime() - todayStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getRegistrationProgress = () => {
    if (!competition.maxParticipants) return 0;
    return (competition.participants / competition.maxParticipants) * 100;
  };

  const daysLeft = getDaysUntilDeadline();
  const registrationProgress = getRegistrationProgress();

  // Mock similar competitions
  const similarCompetitions = mockCompetitions
    .filter(
      (comp) =>
        comp.id !== competition.id && comp.category === competition.category,
    )
    .slice(0, 3);

  // Mock participants
  const participants = mockUsers.slice(0, 8);

  // Đề xuất bạn thi: cùng lĩnh vực hoặc random
  const recommendFriends = useMemo(() => {
    // Lấy các user có kỹ năng hoặc lĩnh vực trùng với requiredSkills của cuộc thi
    const requiredSkillNames = competition.requiredSkills.map((s) => s.name.toLowerCase());
    const bySkill = mockUsers.filter((u) =>
      u.skills.some((s) => requiredSkillNames.includes(s.name.toLowerCase()))
    );
    // Nếu không đủ, lấy random
    if (bySkill.length >= 4) return bySkill.slice(0, 4);
    const others = mockUsers.filter((u) => !bySkill.includes(u));
    return [...bySkill, ...others.slice(0, 4 - bySkill.length)];
  }, [competition]);

  // Đề xuất thí sinh nổi bật cho ban tổ chức
  const recommendedUsers = useMemo(
    () =>
      mockUsers
        .filter((u) => u.rating >= 4.7 || u.isVerified)
        .slice(0, 4),
    []
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-purple-50 to-blue-50">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Info */}
            <div className="flex-1 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{getCategoryIcon()}</div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {competition.category}
                    </Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                      {competition.title}
                    </h1>
                  </div>
                </div>
                <div className="hidden lg:block">
                  {getStatusBadge()}
                </div>
              </div>

              <div className="lg:hidden">
                {getStatusBadge()}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {competition.description}
              </p>

              {/* Key Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Hạn đăng ký</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateShort(competition.registrationDeadline)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Địa điểm</div>
                    <div className="text-sm text-muted-foreground">
                      {competition.location}{" "}
                      {competition.isOnline && "(Online)"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Người tham gia</div>
                    <div className="text-sm text-muted-foreground">
                      {competition.participants} người
                      {competition.maxParticipants &&
                        ` / ${competition.maxParticipants}`}
                    </div>
                  </div>
                </div>

                {competition.prizePool && (
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">Giải thưởng</div>
                      <div className="text-sm text-muted-foreground">
                        {competition.prizePool}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {competition.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:w-96">
              <Card className="sticky top-4">
                <CardContent className="pt-6">
                  {/* Competition Thumbnail */}
                  <div className="mb-6">
                    {competition.imageUrl ? (
                      <img
                        src={competition.imageUrl}
                        alt={competition.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={e => { (e.target as HTMLImageElement).src = "/thi.png"; }}
                      />
                    ) : (
                      <img
                        src="/thi.png"
                        alt="Default Competition Thumbnail"
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                  </div>

                  {/* Countdown */}
                  {daysLeft > 0 && (
                    <div className="text-center mb-6 p-4 bg-primary/5 rounded-lg">
                      <div className="text-4xl font-bold text-primary mb-1">
                        {daysLeft}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ngày còn lại để đăng ký
                      </div>
                    </div>
                  )}

                  {daysLeft < 0 && (
                    <div className="flex items-center gap-2 mb-6 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-sm text-red-700">
                        Đã hết hạn đăng ký
                      </span>
                    </div>
                  )}

                  {/* Registration Progress */}
                  {competition.maxParticipants && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Đã đăng ký</span>
                        <span>
                          {competition.participants}/
                          {competition.maxParticipants}
                        </span>
                      </div>
                      <Progress
                        value={registrationProgress}
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {isUserRegistered ? (
                      <Button 
                        className="w-full" 
                        variant="secondary"
                        size="lg"
                        disabled
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Đã đăng ký
                      </Button>
                    ) : competition.status === "registration-open" && daysLeft > 0 ? (
                      hasTeam ? (
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => setIsRegistrationModalOpen(true)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Đăng ký tham gia
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          size="lg"
                          variant="outline"
                          onClick={() => navigate("/teams")}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Tạo nhóm để đăng ký
                        </Button>
                      )
                    ) : (
                      <Button
                        className="w-full"
                        variant="outline"
                        size="lg"
                        disabled
                      >
                        {competition.status === "completed"
                          ? "Đã kết thúc"
                          : daysLeft < 0
                          ? "Đã hết hạn đăng ký"
                          : "Chưa mở đăng ký"}
                      </Button>
                    )}

                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className={"w-full flex justify-center items-center " + (isInterested ? "bg-yellow-100 border-yellow-400" : "")}
                        onClick={() => setIsInterested((prev) => !prev)}
                        aria-label="Thể hiện sự quan tâm"
                      >
                        <Flag className={isInterested ? "h-4 w-4 text-yellow-500 fill-yellow-400 mr-2" : "h-4 w-4 mr-2"} />
                        <span>Quan tâm</span>
                      </Button>
                    </div>

                    {competition.website && (
                      <Button variant="outline" className="w-full mt-2" asChild>
                        <a
                          href={competition.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Website chính thức
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Registration Info for Registered Users */}
                  {isUserRegistered && userRegistration && (
                    <>
                      <Separator className="my-4" />
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">Đã đăng ký thành công</span>
                        </div>
                        <div className="text-sm text-green-700">
                          Ngày đăng ký: {formatDateShort(userRegistration.registeredAt)}
                        </div>
                        <div className="text-sm text-green-700">
                          Mã đăng ký: #{userRegistration.teamId}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator className="my-6" />

                  {/* Organizer */}
                  <div>
                    <div className="font-medium mb-2">Ban tổ chức</div>
                    <div className="text-sm text-muted-foreground">
                      {competition.organizer}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {competition && !isUserRegistered && (
        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          competitionId={competition.id}
          competitionTitle={competition.title}
        />
      )}

      {/* Content Tabs */}
      <section className="container py-8">
        {/* Đề xuất bạn thi cho thí sinh */}
        {!isAdmin && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Đề xuất bạn thi phù hợp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendFriends.map((user) => (
                    <Card key={user.id} className="card-hover">
                      <CardContent className="pt-4 flex flex-col items-center">
                        <Avatar className="h-14 w-14 mb-2">
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-center mb-1">{user.fullName}</div>
                        <div className="text-xs text-muted-foreground mb-1">{user.school}</div>
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < Math.floor(user.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300",
                              )}
                            />
                          ))}
                          <span className="text-xs ml-1">({user.rating})</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center mb-2">
                          {user.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill.name} variant="outline" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <Button size="sm" variant="outline" onClick={() => window.location.href = `/user/${user.id}`}>
                            Xem hồ sơ
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleInviteUser(user)}>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Mời tham gia
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleChatWithUser(user)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Trò chuyện
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Đề xuất thí sinh nổi bật cho ban tổ chức */}
        {isAdmin && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  Thí sinh nổi bật (Đề xuất cho bạn)
                  <span className="ml-2 text-xs text-primary font-semibold">Ban tổ chức</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedUsers.map((user) => (
                    <Card key={user.id} className="card-hover">
                      <CardContent className="pt-4 flex flex-col items-center">
                        <Avatar className="h-14 w-14 mb-2">
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-center mb-1">{user.fullName}</div>
                        <div className="text-xs text-muted-foreground mb-1">{user.school}</div>
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < Math.floor(user.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300",
                              )}
                            />
                          ))}
                          <span className="text-xs ml-1">({user.rating})</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center mb-2">
                          {user.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill.name} variant="outline" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <Button size="sm" variant="outline" onClick={() => window.location.href = `/user/${user.id}`}>
                            Xem hồ sơ
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleInviteUser(user)}>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Mời tham gia
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleChatWithUser(user)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Trò chuyện
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="timeline">Lịch trình</TabsTrigger>
            <TabsTrigger value="similar">Tương tự</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mô tả chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {competition.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Đây là cơ hội tuyệt vời để thể hiện kỹ năng và học hỏi từ
                      các chuyên gia hàng đầu trong lĩnh vực. Cuộc thi không chỉ
                      mang lại những giải thưởng hấp dẫn mà còn giúp bạn mở rộng
                      mạng lưới và phát triển sự nghiệp.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kỹ năng yêu cầu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {competition.requiredSkills.map((skill) => (
                        <Badge
                          key={skill.name}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {competition.rules && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Thể lệ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground">
                          Thông tin chi tiết về thể lệ cuộc thi sẽ được cập nhật
                          sớm.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin quan trọng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Cấp độ</div>
                      <Badge
                        variant={
                          competition.level === "expert"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {competition.level}
                      </Badge>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">
                        Thời gian diễn ra
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateShort(competition.startDate)} -{" "}
                        {formatDateShort(competition.endDate)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Hình thức</div>
                      <div className="text-sm text-muted-foreground">
                        {competition.isOnline ? "Trực tuyến" : "Tại địa điểm"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lịch trình cuộc thi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">Mở đăng ký</div>
                      <div className="text-sm text-muted-foreground">
                        Từ ngày {formatDateShort(new Date())}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-orange-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">Hạn đăng ký</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(competition.registrationDeadline)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">Bắt đầu cuộc thi</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(competition.startDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">
                        Kết thúc và công bố kết quả
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(competition.endDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cuộc thi tương tự</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarCompetitions.map((comp) => (
                    <Card key={comp.id} className="card-hover">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{getCategoryIcon()}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 line-clamp-2">
                              {comp.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {comp.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {comp.participants} người
                              </Badge>
                              <Button size="sm" variant="outline" asChild>
                                <a href={`/competition/${comp.id}`}>Xem</a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
