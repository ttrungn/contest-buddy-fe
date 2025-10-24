import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockUsers, mockTeams } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchCompetitionDetail } from "@/services/features/competitions/competitionsSlice";
import RegistrationModal from "@/components/modals/RegistrationModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Flag } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { api } from "@/services/constant/axiosInstance";
import {
  COMPETITION_PARTICIPANTS_CHECK_ENDPOINT,
  COMPETITIONS_CONSTANTS_ENDPOINT,
} from "@/services/constant/apiConfig";

export default function Competition() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { detail: competition, isLoading } = useAppSelector(
    (s) => s.competitions,
  );
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  useEffect(() => {
    if (id) dispatch(fetchCompetitionDetail(id));
  }, [dispatch, id]);
  const isAdmin = false;
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { openChatWithUser } = useChat();
  const [isInterested, setIsInterested] = useState(false);

  // Competition constants state
  const [competitionConstants, setCompetitionConstants] = useState<any>(null);

  // Real registration status from API
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);
  const [userRegistration, setUserRegistration] = useState<any>(null);

  // Mock current user (in real app, this would come from auth context)
  const currentUser = mockUsers[0];

  // API function to fetch competition constants
  const fetchCompetitionConstants = async () => {
    try {
      const response = await api.get(COMPETITIONS_CONSTANTS_ENDPOINT);
      setCompetitionConstants(response.data);
    } catch (error: any) {
      console.error("Error fetching competition constants:", error);
    }
  };

  // API function to check user registration status
  const checkUserRegistration = async () => {
    if (!id) return;

    setIsCheckingRegistration(true);
    try {
      const response = await api.get(
        COMPETITION_PARTICIPANTS_CHECK_ENDPOINT(id),
      );

      // Handle the actual response structure: { success, isRegistered, registrationType, data }
      if (response && response.success) {
        const isRegistered = response.isRegistered;
        setIsUserRegistered(isRegistered || false);

        if (isRegistered && response.data) {
          setUserRegistration({
            ...response.data,
            registrationType: response.registrationType,
            registeredAt: response.data.registrationDate,
          });
        }
      }
    } catch (error: any) {
      console.error("Error checking registration status:", error);
      // Don't show error toast for this check as it's not critical
      setIsUserRegistered(false);
    } finally {
      setIsCheckingRegistration(false);
    }
  };

  // Check registration status when component mounts or competition ID changes
  useEffect(() => {
    if (id) {
      checkUserRegistration();
    }
  }, [id]);

  // Fetch competition constants when component mounts
  useEffect(() => {
    fetchCompetitionConstants();
  }, []);

  // Check if user is in any team
  const userTeams = mockTeams.filter((team) =>
    team.members.some((m) => m.userId === currentUser.id),
  );
  const hasTeam = userTeams.length > 0;

  const handleChatWithUser = (user: any) => {
    openChatWithUser(user.id, user.fullName);
  };

  const handleRegistrationClick = () => {
    if (!isAuthenticated) {
      // Redirect to login page if user is not authenticated
      navigate("/login");
      return;
    }
    // If authenticated, open registration modal
    setIsRegistrationModalOpen(true);
  };

  // Read normalized camelCase data directly from store
  const norm = competition;

  if ((!competition && !isLoading) || !competitionConstants) {
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
    if (!norm) return null;

    // Check if registration deadline has passed
    const daysLeft = getDaysUntilDeadline();
    const isRegistrationExpired = daysLeft < 0;

    // If registration is expired, show expired status regardless of API status
    if (
      isRegistrationExpired &&
      (norm.status === "registration_open")
    ) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          Đã hết hạn đăng ký
        </Badge>
      );
    }

    switch (norm.status as any) {
      case "registration_open":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Đang mở đăng ký
          </Badge>
        );
      case "upcoming":
        return <Badge variant="secondary">Sắp diễn ra</Badge>;
      case "in_progress":
      case "ongoing":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return <Badge variant="outline">Đã kết thúc</Badge>;
      case "registration_closed":
        return <Badge variant="outline">Đã đóng đăng ký</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
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
    const key = (norm?.category as string) || "";
    return iconMap[key] || "🏆";
  };

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return "--";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC"
    }).format(d);
  };

  const formatDateShort = (date: Date | string | undefined | null) => {
    if (!date) return "--/--";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "--/--";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    }).format(d);
  };

  const getDaysUntilDeadline = () => {
    const today = new Date();
    const deadline = new Date((norm as any)?.registrationDeadline);

    // Reset time to start of day for accurate comparison
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const deadlineStart = new Date(
      deadline.getFullYear(),
      deadline.getMonth(),
      deadline.getDate(),
    );

    const diffTime = deadlineStart.getTime() - todayStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getRegistrationProgress = () => {
    const participants = (norm as any)?.participants || 0;
    const max = (norm as any)?.maxParticipants || 0;
    if (!max) return 0;
    return (participants / max) * 100;
  };

  const daysLeft = getDaysUntilDeadline();
  const registrationProgress = getRegistrationProgress();

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
                      {norm?.category}
                    </Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                      {norm?.title}
                    </h1>
                  </div>
                </div>
                <div className="hidden lg:block">{getStatusBadge()}</div>
              </div>

              <div className="lg:hidden">{getStatusBadge()}</div>

              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                {norm?.description}
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
                      {formatDateShort(norm?.registrationDeadline as any)}
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
                      {norm?.location}
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
                      {norm?.participants} người
                      {norm?.maxParticipants && ` / ${norm?.maxParticipants}`}
                    </div>
                  </div>
                </div>

                {norm?.prizePool && (
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">Giải thưởng</div>
                      <div className="text-sm text-muted-foreground">
                        {norm?.prizePool}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(norm?.tags || []).map((tag: string) => (
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
                  {norm?.imageUrl && (
                    <div className="mb-6">
                      <img
                        src={norm.imageUrl}
                        alt={norm.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/thi.png";
                        }}
                      />
                    </div>
                  )}

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
                  {norm?.maxParticipants && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Đã đăng ký</span>
                        <span>
                          {norm?.participants}/{norm?.maxParticipants}
                        </span>
                      </div>
                      <Progress value={registrationProgress} className="h-2" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {isUserRegistered ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                        disabled
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Đã đăng ký
                      </Button>
                    ) : (norm?.status ===
                      competitionConstants.statuses.REGISTRATION_OPEN) &&
                      daysLeft >= 0 ? (
                      !norm?.isRegisteredAsTeam ? (
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleRegistrationClick}
                          disabled={isCheckingRegistration}
                        >
                          {isCheckingRegistration ? (
                            <>
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Đang kiểm tra...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Đăng ký tham gia
                            </>
                          )}
                        </Button>
                      ) : hasTeam ? (
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleRegistrationClick}
                          disabled={isCheckingRegistration}
                        >
                          {isCheckingRegistration ? (
                            <>
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Đang kiểm tra...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Đăng ký tham gia
                            </>
                          )}
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
                        {norm?.status ===
                          competitionConstants.statuses.COMPLETED
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
                        className={
                          "w-full flex justify-center items-center " +
                          (isInterested
                            ? "bg-yellow-100 border-yellow-400"
                            : "")
                        }
                        onClick={() => setIsInterested((prev) => !prev)}
                        aria-label="Thể hiện sự quan tâm"
                      >
                        <Flag
                          className={
                            isInterested
                              ? "h-4 w-4 text-yellow-500 fill-yellow-400 mr-2"
                              : "h-4 w-4 mr-2"
                          }
                        />
                        <span>Quan tâm</span>
                      </Button>
                    </div>

                    {norm?.website && (
                      <Button variant="outline" className="w-full mt-2" asChild>
                        <a
                          href={norm.website}
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
                          <span className="font-medium text-green-800">
                            Đã đăng ký thành công
                          </span>
                        </div>
                        <div className="text-sm text-green-700">
                          Ngày đăng ký:{" "}
                          {formatDateShort(userRegistration.registeredAt)}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator className="my-6" />

                  {/* Organizer (from response) */}
                  {(norm as any)?.organizer?.email ||
                    (norm as any)?.organizer?.website ? (
                    <div>
                      <div className="font-medium mb-2">Ban tổ chức</div>
                      <div className="text-sm text-muted-foreground break-words">
                        {(norm as any)?.organizer?.email && (
                          <div>Email: {(norm as any).organizer.email}</div>
                        )}
                        {(norm as any)?.organizer?.website && (
                          <div>
                            Website:{" "}
                            <a
                              className="underline"
                              href={(norm as any).organizer.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {(norm as any).organizer.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {norm && !isUserRegistered && (
        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => {
            setIsRegistrationModalOpen(false);
            // Refresh registration status after modal closes
            checkUserRegistration();
          }}
          competitionId={norm.id}
          competitionTitle={norm.title}
          isRegisteredAsTeam={norm.isRegisteredAsTeam || false}
          maxParticipantsPerTeam={norm.maxParticipantsPerTeam}
        />
      )}

      {/* Content Tabs */}
      <section className="container py-8">
        {/* Recommendation sections removed to match API data */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="timeline">Lịch trình</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mô tả chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                      {norm?.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kỹ năng yêu cầu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(norm?.requiredSkills || []).map((skill: any) => (
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

                {norm?.prizePool && norm?.prizePool.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Giải thưởng</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground">
                          {norm.prizePool}
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
                      {norm?.level && (
                        <Badge
                          variant={
                            (norm.level as any) === "expert"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {norm.level}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">
                        Thời gian diễn ra
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateShort(norm?.startDate as any)} -{" "}
                        {formatDateShort(norm?.endDate as any)}
                      </div>
                    </div>

                    {/* Hình thức không có trong response -> ẩn */}
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
                        {formatDate(norm?.registrationDeadline as any)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium">Bắt đầu cuộc thi</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(norm?.startDate as any)}
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
                        {formatDate(norm?.endDate as any)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar competitions tab removed */}
        </Tabs>
      </section>
    </div>
  );
}
