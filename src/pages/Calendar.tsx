import { useState } from "react";
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
import { mockCompetitions } from "@/lib/mockData";
import { Competition } from "@/types";

export default function Calendar() {
  const [selectedView, setSelectedView] = useState<"month" | "week" | "list">(
    "month",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get competitions for current month (only registered and interested)
  const thisMonthCompetitions = mockCompetitions.filter((comp) => {
    const startDate = new Date(comp.startDate);
    const regDate = new Date(comp.registrationDeadline);
    const isRelevant = comp.isRegistered || comp.isInterested;
    return (
      isRelevant &&
      ((startDate.getMonth() === currentMonth &&
        startDate.getFullYear() === currentYear) ||
        (regDate.getMonth() === currentMonth &&
          regDate.getFullYear() === currentYear))
    );
  });

  const upcomingDeadlines = mockCompetitions
    .filter((comp) => {
      const deadline = new Date(comp.registrationDeadline);
      const today = new Date();
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isRelevant = comp.isRegistered || comp.isInterested;
      return isRelevant && diffDays > 0 && diffDays <= 7;
    })
    .sort(
      (a, b) =>
        new Date(a.registrationDeadline).getTime() -
        new Date(b.registrationDeadline).getTime(),
    );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diffTime = new Date(deadline).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Mock calendar grid for current month
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
      const dayCompetitions = mockCompetitions.filter((comp) => {
        const startDate = new Date(comp.startDate);
        const regDate = new Date(comp.registrationDeadline);
        const currentDay = new Date(date);
        const isRelevant = comp.isRegistered || comp.isInterested;
        return (
          isRelevant &&
          (startDate.toDateString() === currentDay.toDateString() ||
            regDate.toDateString() === currentDay.toDateString())
        );
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
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

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
                  {upcomingDeadlines.length} cuộc thi
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
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
                  {upcomingDeadlines.map((competition) => {
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
                    {thisMonthCompetitions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cuộc thi
                  </div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {upcomingDeadlines.length}
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
                    {thisMonthCompetitions.filter(comp => comp.isRegistered).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cuộc thi quan tâm:</span>
                  <span className="font-medium">
                    {thisMonthCompetitions.filter(comp => comp.isInterested && !comp.isRegistered).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cuộc thi online:</span>
                  <span className="font-medium">
                    {thisMonthCompetitions.filter(comp => comp.isOnline).length}
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
                      className={`min-h-[100px] p-2 border rounded-lg ${
                        day.isCurrentMonth ? "bg-background" : "bg-muted/30"
                      } ${
                        day.date.toDateString() === currentDate.toDateString()
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          day.isCurrentMonth
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
                              className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                                isDeadline
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
