import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Trophy,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockCompetitionManagement, mockUsers } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const competitions = mockCompetitionManagement;
  const totalRevenue = competitions.reduce(
    (sum, comp) => sum + comp.finances.totalRevenue,
    0,
  );
  const totalRegistrations = competitions.reduce(
    (sum, comp) => sum + comp.statistics.totalRegistrations,
    0,
  );

  // Mock data for charts
  const registrationTrend = [
    { month: "T1", value: 450 },
    { month: "T2", value: 680 },
    { month: "T3", value: 1250 },
    { month: "T4", value: 890 },
    { month: "T5", value: 1450 },
    { month: "T6", value: 1800 },
  ];

  const revenueTrend = [
    { month: "T1", value: 125000000 },
    { month: "T2", value: 180000000 },
    { month: "T3", value: 625000000 },
    { month: "T4", value: 420000000 },
    { month: "T5", value: 780000000 },
    { month: "T6", value: 950000000 },
  ];

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    change,
    changeType,
    period = "so với tháng trước",
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    change: number;
    changeType: "up" | "down";
    period?: string;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center mt-2">
              {changeType === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  changeType === "up" ? "text-green-600" : "text-red-600",
                )}
              >
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                {period}
              </span>
            </div>
          </div>
          <Icon className={cn("h-8 w-8", color)} />
        </div>
      </CardContent>
    </Card>
  );

  const ChartCard = ({
    title,
    data,
    type = "line",
    color = "blue",
    format = "number",
  }: {
    title: string;
    data: any[];
    type?: "line" | "bar";
    color?: string;
    format?: "number" | "currency";
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {type === "line" ? (
            <LineChart className="h-5 w-5" />
          ) : (
            <BarChart3 className="h-5 w-5" />
          )}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end space-x-2">
          {data.map((item, index) => {
            const maxValue = Math.max(...data.map((d) => d.value));
            const height = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">
                  {format === "currency"
                    ? formatCurrency(item.value)
                    : item.value.toLocaleString()}
                </div>
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-300",
                    color === "blue"
                      ? "bg-blue-500"
                      : color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500",
                  )}
                  style={{ height: `${height}%`, minHeight: "4px" }}
                />
                <div className="text-xs mt-1 font-medium">{item.month}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Phân tích dữ liệu</h1>
            <p className="text-muted-foreground">
              Dashboard analytics và insights chi tiết
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
                <SelectItem value="quarter">3 tháng qua</SelectItem>
                <SelectItem value="year">1 năm qua</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Tùy chỉnh thời gian
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Tổng doanh thu"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            color="text-green-600"
            change={15.2}
            changeType="up"
          />
          <MetricCard
            title="Tổng ��ăng ký"
            value={totalRegistrations.toLocaleString()}
            icon={Users}
            color="text-blue-600"
            change={22.5}
            changeType="up"
          />
          <MetricCard
            title="Tỷ lệ chuyển đổi"
            value="12.8%"
            icon={Target}
            color="text-purple-600"
            change={3.2}
            changeType="up"
          />
          <MetricCard
            title="Người dùng hoạt động"
            value="2,847"
            icon={Activity}
            color="text-orange-600"
            change={8.1}
            changeType="down"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="growth">Tăng trưởng</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="competitions">Cuộc thi</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Xu hướng đăng ký (6 tháng qua)"
                data={registrationTrend}
                type="line"
                color="blue"
                format="number"
              />
              <ChartCard
                title="Xu hướng doanh thu (6 tháng qua)"
                data={revenueTrend}
                type="bar"
                color="green"
                format="currency"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top cuộc thi theo đăng ký</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitions
                      .sort(
                        (a, b) =>
                          b.statistics.totalRegistrations -
                          a.statistics.totalRegistrations,
                      )
                      .slice(0, 5)
                      .map((comp, index) => (
                        <div
                          key={comp.id}
                          className="flex items-center space-x-3"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {comp.competition.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {comp.statistics.totalRegistrations} đăng ký
                            </p>
                          </div>
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phân bố theo danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      competitions.reduce(
                        (acc: Record<string, number>, comp) => {
                          acc[comp.competition.category] =
                            (acc[comp.competition.category] || 0) +
                            comp.statistics.totalRegistrations;
                          return acc;
                        },
                        {},
                      ),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, count]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{category}</span>
                            <span>{count} đăng ký</span>
                          </div>
                          <Progress
                            value={(count / totalRegistrations) * 100}
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chỉ số hiệu suất</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tỷ lệ hoàn thành trung bình</span>
                      <span className="font-medium">
                        {(
                          competitions.reduce(
                            (sum, comp) => sum + comp.statistics.completionRate,
                            0,
                          ) / competitions.length
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        competitions.reduce(
                          (sum, comp) => sum + comp.statistics.completionRate,
                          0,
                        ) / competitions.length
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Đánh giá trung bình</span>
                      <span className="font-medium">
                        {(
                          competitions.reduce(
                            (sum, comp) => sum + comp.statistics.averageRating,
                            0,
                          ) / competitions.length
                        ).toFixed(1)}
                        /5.0
                      </span>
                    </div>
                    <Progress
                      value={
                        (competitions.reduce(
                          (sum, comp) => sum + comp.statistics.averageRating,
                          0,
                        ) /
                          competitions.length) *
                        20
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tỷ lệ phê duyệt</span>
                      <span className="font-medium">
                        {(
                          competitions.reduce(
                            (sum, comp) =>
                              sum +
                              (comp.statistics.approvedRegistrations /
                                comp.statistics.totalRegistrations) *
                                100,
                            0,
                          ) / competitions.length
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        competitions.reduce(
                          (sum, comp) =>
                            sum +
                            (comp.statistics.approvedRegistrations /
                              comp.statistics.totalRegistrations) *
                              100,
                          0,
                        ) / competitions.length
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Growth */}
          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tăng trưởng theo tháng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        metric: "Đăng ký mới",
                        current: 1250,
                        previous: 1020,
                        unit: "",
                      },
                      {
                        metric: "Doanh thu",
                        current: 625000000,
                        previous: 540000000,
                        unit: "VNĐ",
                        format: "currency",
                      },
                      {
                        metric: "Người dùng mới",
                        current: 340,
                        previous: 280,
                        unit: "",
                      },
                      {
                        metric: "Cuộc thi mới",
                        current: 12,
                        previous: 8,
                        unit: "",
                      },
                    ].map((item) => {
                      const growth =
                        ((item.current - item.previous) / item.previous) * 100;
                      return (
                        <div
                          key={item.metric}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium">{item.metric}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.format === "currency"
                                ? formatCurrency(item.current)
                                : `${item.current.toLocaleString()}${item.unit}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={cn(
                                "flex items-center text-sm font-medium",
                                growth >= 0 ? "text-green-600" : "text-red-600",
                              )}
                            >
                              {growth >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              {Math.abs(growth).toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              vs tháng trước
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dự báo xu hướng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">
                            Tăng trưởng mạnh
                          </p>
                          <p className="text-sm text-green-700">
                            Dự kiến doanh thu tháng tới sẽ tăng 18-25% dựa trên
                            xu hướng hiện tại
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-800">
                            Cơ hội tăng trưởng
                          </p>
                          <p className="text-sm text-blue-700">
                            Thị trường miền Trung có tiềm năng lớn với tỷ lệ
                            tăng trưởng 35%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex items-start space-x-3">
                        <Activity className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-800">
                            Cần chú ý
                          </p>
                          <p className="text-sm text-orange-700">
                            Tỷ lệ chuyển đổi từ đăng ký thành tham gia có xu
                            hướng giảm nhẹ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phân tích người dùng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tổng người dùng</span>
                    <span className="font-bold">{mockUsers.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>Tăng trưởng tháng này</span>
                    <Badge className="bg-green-100 text-green-700">
                      +23.5%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Retention rate</span>
                    <span className="font-medium">82.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. session time</span>
                    <span className="font-medium">12m 34s</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phân bố theo kỹ năng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      mockUsers
                        .flatMap((u) => u.skills)
                        .reduce((acc: Record<string, number>, skill) => {
                          acc[skill.category] = (acc[skill.category] || 0) + 1;
                          return acc;
                        }, {}),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([category, count]) => (
                        <div key={category} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{category}</span>
                            <span>{count} skills</span>
                          </div>
                          <Progress
                            value={
                              (count /
                                mockUsers.flatMap((u) => u.skills).length) *
                              100
                            }
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top trường học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      mockUsers.reduce((acc: Record<string, number>, user) => {
                        acc[user.school] = (acc[user.school] || 0) + 1;
                        return acc;
                      }, {}),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([school, count], index) => (
                        <div
                          key={school}
                          className="flex items-center space-x-3"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {school}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {count} users
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Competitions */}
          <TabsContent value="competitions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitions.map((comp) => {
                      const roi =
                        ((comp.finances.totalRevenue -
                          comp.finances.totalExpenses) /
                          comp.finances.totalExpenses) *
                        100;
                      const participationRate =
                        (comp.statistics.approvedRegistrations /
                          (comp.settings.maxParticipants ||
                            comp.statistics.totalRegistrations)) *
                        100;

                      return (
                        <div
                          key={comp.id}
                          className="p-4 rounded-lg border space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">
                              {comp.competition.title}
                            </h4>
                            <Badge
                              className={
                                roi > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              ROI: {roi.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Đăng ký:{" "}
                              </span>
                              <span className="font-medium">
                                {comp.statistics.totalRegistrations}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Hoàn thành:{" "}
                              </span>
                              <span className="font-medium">
                                {comp.statistics.completionRate}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Rating:{" "}
                              </span>
                              <span className="font-medium">
                                {comp.statistics.averageRating}/5.0
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Doanh thu:{" "}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(comp.finances.totalRevenue)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <Trophy className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-800">
                            Best Performer
                          </p>
                          <p className="text-sm text-blue-700">
                            "Vietnam Startup Challenge 2024" có ROI cao nhất
                            (3.3%) và tỷ lệ hoàn thành tốt
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-start space-x-3">
                        <Target className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">
                            Optimization Opportunity
                          </p>
                          <p className="text-sm text-green-700">
                            Tăng marketing cho cuộc thi design có thể cải thiện
                            tỷ lệ đăng ký 15-20%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-purple-800">
                            Audience Insight
                          </p>
                          <p className="text-sm text-purple-700">
                            Sinh viên Hà Nội và TP.HCM chiếm 68% tổng đăng ký,
                            cơ hội mở rộng ra các tỉnh khác
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
