import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Download,
  Settings,
  Bell,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CompetitionCard from "@/components/CompetitionCard";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import {
  fetchCalendarEvents,
  fetchParticipatedCompetitions,
  selectCalendarEvents,
  selectParticipatedCompetitions,
  selectUpcomingDeadlines,
  selectMonthlyStats,
  selectCalendarLoading,
  selectCalendarError
} from "@/services/features/calendar/calendarSlice";
import { CalendarEvent, ParticipatedCompetition } from "@/interfaces/ICalendar";

export default function Calendar() {
  const dispatch = useAppDispatch();
  const [selectedView, setSelectedView] = useState<"month" | "week" | "list">(
    "month",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Redux selectors
  const calendarEvents = useAppSelector(selectCalendarEvents);
  const participatedCompetitions = useAppSelector(selectParticipatedCompetitions);
  const upcomingDeadlines = useAppSelector(selectUpcomingDeadlines);
  const monthlyStats = useAppSelector(selectMonthlyStats);
  const isLoading = useAppSelector(selectCalendarLoading);
  const error = useAppSelector(selectCalendarError);

  // Helper function to filter valid deadlines
  const getValidDeadlines = () => {
    return (upcomingDeadlines || []).filter((competition) => {
      return (
        competition &&
        competition.title &&
        competition.title.trim() !== "" &&
        competition.registrationDeadline &&
        competition.registrationDeadline.trim() !== ""
      );
    });
  };

  // Load data on component mount
  useEffect(() => {
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Fetch calendar events for current month
    dispatch(fetchCalendarEvents({
      from: startOfMonth.toISOString().split('T')[0],
      to: endOfMonth.toISOString().split('T')[0],
      type: 'competition'
    }));

    // Fetch participated competitions
    dispatch(fetchParticipatedCompetitions());
  }, [dispatch, currentYear, currentMonth]);

  // Transform participated competitions to match the old format
  const thisMonthCompetitions = (participatedCompetitions || []).map((item) => {
    // Helper function to safely create dates
    const safeDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
      } catch {
        return new Date();
      }
    };

    return {
      id: item.competition.id,
      title: item.competition.title,
      description: item.competition.description,
      category: item.competition.category,
      organizer: 'Unknown Organizer', // Default organizer since it's not in the API response
      startDate: safeDate(item.competition.start_date),
      endDate: safeDate(item.competition.end_date),
      registrationDeadline: safeDate(item.competition.registration_deadline),
      location: item.competition.location,
      isOnline: false, // You might need to add this field to the API response
      prizePool: item.competition.prize_pool_text,
      participants: item.competition.participants_count,
      maxParticipants: item.competition.max_participants,
      level: item.competition.level,
      imageUrl: item.competition.image_url,
      website: '',
      rules: '',
      featured: item.competition.featured,
      status: item.competition.status,
      isRegistered: true,
      isInterested: false,
      registrationDate: safeDate(item.participation.registrationDate),
      paymentStatus: item.participation.paymentStatus,
      requiredSkills: [],
      tags: [],
    };
  });

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return "N/A";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "N/A";
      }
      return new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const formatTime = (date: Date | string | undefined | null) => {
    if (!date) return "N/A";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "N/A";
      }
      return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "N/A";
    }
  };

  const getDaysUntilDeadline = (deadline: Date | string | undefined | null) => {
    if (!deadline) return 0;

    try {
      const today = new Date();
      const deadlineDate = new Date(deadline);

      if (isNaN(deadlineDate.getTime())) {
        return 0;
      }

      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      console.error("Error calculating days until deadline:", error);
      return 0;
    }
  };

  // Generate calendar grid for current month
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days = [];
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayCompetitions = thisMonthCompetitions.filter((comp) => {
        try {
          const startDate = new Date(comp.startDate);
          const regDate = new Date(comp.registrationDeadline);
          const endDate = new Date(comp.endDate);
          const currentDay = new Date(date);

          // Check if dates are valid
          if (isNaN(startDate.getTime()) || isNaN(regDate.getTime()) || isNaN(endDate.getTime()) || isNaN(currentDay.getTime())) {
            return false;
          }

          return (
            startDate.toDateString() === currentDay.toDateString() ||
            regDate.toDateString() === currentDay.toDateString() ||
            endDate.toDateString() === currentDay.toDateString()
          );
        } catch (error) {
          console.error("Error filtering day competitions:", error);
          return false;
        }
      });

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === currentMonth,
        competitions: dayCompetitions,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const goToPreviousMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(newDate);

    // Fetch data for the new month
    const startOfMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const endOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    dispatch(fetchCalendarEvents({
      from: startOfMonth.toISOString().split('T')[0],
      to: endOfMonth.toISOString().split('T')[0],
      type: 'competition'
    }));
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(newDate);

    // Fetch data for the new month
    const startOfMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const endOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    dispatch(fetchCalendarEvents({
      from: startOfMonth.toISOString().split('T')[0],
      to: endOfMonth.toISOString().split('T')[0],
      type: 'competition'
    }));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);

    // Fetch data for current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    dispatch(fetchCalendarEvents({
      from: startOfMonth.toISOString().split('T')[0],
      to: endOfMonth.toISOString().split('T')[0],
      type: 'competition'
    }));
  };

  // Show loading state
  if (isLoading || !participatedCompetitions) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải lịch cuộc thi...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <Bell className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Lỗi tải dữ liệu</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => {
                const startOfMonth = new Date(currentYear, currentMonth, 1);
                const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
                dispatch(fetchCalendarEvents({
                  from: startOfMonth.toISOString().split('T')[0],
                  to: endOfMonth.toISOString().split('T')[0],
                  type: 'competition'
                }));
                dispatch(fetchParticipatedCompetitions());
              }}>
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lịch cuộc thi</h1>
            <p className="text-muted-foreground">
              Theo dõi các cuộc thi và deadline quan trọng
            </p>
          </div>
        </div>

        {/* Quick Actions & Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Deadline sắp tới
                </CardTitle>
                <Badge variant="secondary">
                  {getValidDeadlines().length} cuộc thi
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {getValidDeadlines().length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Không có deadline nào trong 7 ngày tới
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bạn có thể yên tâm tập trung vào các cuộc thi hiện tại
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getValidDeadlines().map((competition) => {
                    const daysLeft = getDaysUntilDeadline(
                      competition.registrationDeadline,
                    );
                    return (
                      <div
                        key={competition.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-lg">
                            {competition.title}
                          </h4>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {formatDate(competition.registrationDeadline)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {competition.isOnline ? "Online" : competition.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {competition.participants} thí sinh
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              daysLeft <= 2
                                ? "destructive"
                                : daysLeft <= 5
                                  ? "default"
                                  : "secondary"
                            }
                            className="mb-2 text-sm px-3 py-1"
                          >
                            {daysLeft === 1
                              ? "Còn 1 ngày"
                              : daysLeft === 0
                                ? "Hôm nay"
                                : `Còn ${daysLeft} ngày`}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Hạn đăng ký cuối cùng
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Thống kê tháng này
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {monthlyStats?.totalCompetitions || thisMonthCompetitions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cuộc thi
                  </div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {monthlyStats?.upcomingDeadlines || upcomingDeadlines.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Deadline sắp tới
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cuộc thi đã đăng ký:</span>
                  <span className="font-medium">
                    {monthlyStats?.registered || thisMonthCompetitions.filter(comp => comp.isRegistered).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cuộc thi quan tâm:</span>
                  <span className="font-medium">
                    {monthlyStats?.interested || thisMonthCompetitions.filter(comp => comp.isInterested && !comp.isRegistered).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cuộc thi online:</span>
                  <span className="font-medium">
                    {monthlyStats?.online || thisMonthCompetitions.filter(comp => comp.isOnline).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Views */}
        <Tabs
          value={selectedView}
          onValueChange={(value) => setSelectedView(value as any)}
        >
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="list">Danh sách</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Lọc theo lĩnh vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="programming">Lập trình</SelectItem>
                  <SelectItem value="design">Thiết kế</SelectItem>
                  <SelectItem value="business">Kinh doanh</SelectItem>
                  <SelectItem value="science">Khoa học</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="month">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousMonth}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xl min-w-[120px] text-center">
                        Tháng {currentMonth + 1}, {currentYear}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextMonth}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToToday}
                    >
                      Hôm nay
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Bắt đầu thi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Hạn đăng ký</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Kết thúc</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center font-semibold text-sm text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg ${day.isCurrentMonth ? "bg-background" : "bg-muted/30"
                        } ${day.date.toDateString() === currentDate.toDateString()
                          ? "ring-2 ring-primary"
                          : ""
                        }`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${day.isCurrentMonth
                          ? "text-foreground"
                          : "text-muted-foreground"
                          }`}
                      >
                        {day.date.getDate()}
                      </div>

                      <div className="space-y-1">
                        {day.competitions.slice(0, 2).map((comp) => {
                          const isDeadline =
                            new Date(
                              comp.registrationDeadline,
                            ).toDateString() === day.date.toDateString();
                          const isStart =
                            new Date(comp.startDate).toDateString() ===
                            day.date.toDateString();
                          const isEnd =
                            new Date(comp.endDate).toDateString() ===
                            day.date.toDateString();

                          return (
                            <div
                              key={comp.id}
                              className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${isDeadline
                                ? "bg-orange-100 text-orange-700 border border-orange-200"
                                : isEnd
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : comp.isRegistered
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "bg-purple-100 text-purple-700 border border-purple-200"
                                }`}
                              title={`${comp.title} - ${isDeadline ? 'Hạn đăng ký' : isEnd ? 'Kết thúc' : comp.isRegistered ? 'Đã đăng ký' : 'Quan tâm'}`}
                            >
                              {comp.title}
                            </div>
                          );
                        })}
                        {day.competitions.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{day.competitions.length - 2} khác
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week">
            <Card>
              <CardHeader>
                <CardTitle>Tuần này</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Chế độ xem tuần đang được phát triển
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Cuộc thi tháng này ({thisMonthCompetitions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {thisMonthCompetitions.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg mb-2">
                        Không có cuộc thi nào trong tháng này
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Hãy kiểm tra các tháng khác hoặc đăng ký thông báo để không bỏ lỡ cuộc thi mới
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {thisMonthCompetitions.map((competition) => (
                        <CompetitionCard
                          key={competition.id}
                          competition={competition}
                          variant="compact"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
