import { useState } from "react";
import {
  Download,
  Filter,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Trophy,
  BarChart3,
  PieChart,
  FileText,
  Mail,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { mockCompetitionManagement, mockUsers } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCompetition, setSelectedCompetition] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const competitions = mockCompetitionManagement;
  const totalRevenue = competitions.reduce(
    (sum, comp) => sum + comp.finances.totalRevenue,
    0,
  );
  const totalExpenses = competitions.reduce(
    (sum, comp) => sum + comp.finances.totalExpenses,
    0,
  );
  const totalRegistrations = competitions.reduce(
    (sum, comp) => sum + comp.statistics.totalRegistrations,
    0,
  );

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    change,
    trend,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    change?: string;
    trend?: "up" | "down" | "stable";
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                <TrendingUp
                  className={cn(
                    "h-3 w-3 mr-1",
                    trend === "up"
                      ? "text-green-500"
                      : trend === "down"
                        ? "text-red-500"
                        : "text-gray-500",
                  )}
                />
                <p className="text-xs text-muted-foreground">{change}</p>
              </div>
            )}
          </div>
          <Icon className={cn("h-8 w-8", color)} />
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
            <h1 className="text-3xl font-bold mb-2">Báo cáo & Thống kê</h1>
            <p className="text-muted-foreground">
              Tổng quan hoạt động và phân tích dữ liệu
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
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            color="text-green-600"
            change="+15.2% so với tháng trước"
            trend="up"
          />
          <StatCard
            title="Tổng chi phí"
            value={formatCurrency(totalExpenses)}
            icon={TrendingUp}
            color="text-red-600"
            change="+8.1% so với tháng trước"
            trend="up"
          />
          <StatCard
            title="Tổng đăng ký"
            value={totalRegistrations}
            icon={Users}
            color="text-blue-600"
            change="+22.5% so với tháng trước"
            trend="up"
          />
          <StatCard
            title="Lợi nhuận"
            value={formatCurrency(totalRevenue - totalExpenses)}
            icon={Trophy}
            color="text-purple-600"
            change="+25.8% so với tháng trước"
            trend="up"
          />
        </div>

        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial">Báo cáo tài chính</TabsTrigger>
            <TabsTrigger value="users">Báo cáo người dùng</TabsTrigger>
            <TabsTrigger value="competitions">Báo cáo cuộc thi</TabsTrigger>
            <TabsTrigger value="performance">Báo cáo hiệu suất</TabsTrigger>
          </TabsList>

          {/* Financial Reports */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo cuộc thi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitions.map((comp) => (
                      <div key={comp.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">
                            {comp.competition.title}
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(comp.finances.totalRevenue)}
                          </span>
                        </div>
                        <Progress
                          value={
                            (comp.finances.totalRevenue / totalRevenue) * 100
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chi phí theo danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitions
                      .flatMap((comp) => comp.finances.expenses)
                      .reduce((acc: any[], expense) => {
                        const existing = acc.find(
                          (item) => item.category === expense.category,
                        );
                        if (existing) {
                          existing.amount += expense.amount;
                        } else {
                          acc.push({
                            category: expense.category,
                            amount: expense.amount,
                          });
                        }
                        return acc;
                      }, [])
                      .sort((a, b) => b.amount - a.amount)
                      .map((item) => (
                        <div key={item.category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">
                              {item.category}
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                          <Progress
                            value={(item.amount / totalExpenses) * 100}
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết giao dịch gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cuộc thi</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitions
                      .flatMap((comp) =>
                        [...comp.finances.revenue, ...comp.finances.expenses]
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime(),
                          )
                          .slice(0, 10)
                          .map((entry) => ({
                            ...entry,
                            competitionTitle: comp.competition.title,
                          })),
                      )
                      .map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {entry.competitionTitle}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                entry.type === "revenue"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {entry.type === "revenue" ? "Thu" : "Chi"}
                            </Badge>
                          </TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell
                            className={
                              entry.type === "revenue"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {entry.type === "revenue" ? "+" : "-"}
                            {formatCurrency(entry.amount)}
                          </TableCell>
                          <TableCell>{formatDate(entry.date)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                entry.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {entry.status === "confirmed"
                                ? "Đã xác nhận"
                                : "Chờ xử lý"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Reports */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê người dùng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tổng người dùng</span>
                    <span className="font-bold">{mockUsers.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Đã xác minh</span>
                    <span className="font-bold text-green-600">
                      {mockUsers.filter((u) => u.isVerified).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chờ xác minh</span>
                    <span className="font-bold text-yellow-600">
                      {mockUsers.filter((u) => !u.isVerified).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Đánh giá trung bình</span>
                    <span className="font-bold">
                      {(
                        mockUsers.reduce((sum, u) => sum + u.rating, 0) /
                        mockUsers.length
                      ).toFixed(1)}
                      /5.0
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Người dùng theo trường</CardTitle>
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
                      .map(([school, count]) => (
                        <div key={school} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="truncate">{school}</span>
                            <span>{count} users</span>
                          </div>
                          <Progress value={(count / mockUsers.length) * 100} />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Người dùng theo khu vực</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      mockUsers.reduce((acc: Record<string, number>, user) => {
                        acc[user.location.region] =
                          (acc[user.location.region] || 0) + 1;
                        return acc;
                      }, {}),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .map(([region, count]) => (
                        <div key={region} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{region}</span>
                            <span>{count} users</span>
                          </div>
                          <Progress value={(count / mockUsers.length) * 100} />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Competition Reports */}
          <TabsContent value="competitions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê cuộc thi</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cuộc thi</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Đăng ký</TableHead>
                      <TableHead>Tỷ lệ hoàn thành</TableHead>
                      <TableHead>Doanh thu</TableHead>
                      <TableHead>ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitions.map((comp) => {
                      const roi =
                        ((comp.finances.totalRevenue -
                          comp.finances.totalExpenses) /
                          comp.finances.totalExpenses) *
                        100;
                      return (
                        <TableRow key={comp.id}>
                          <TableCell className="font-medium">
                            {comp.competition.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                comp.status === "ongoing"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }
                            >
                              {comp.status === "ongoing"
                                ? "Đang diễn ra"
                                : "Hoàn thành"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {comp.statistics.totalRegistrations}/
                            {comp.settings.maxParticipants || "∞"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={comp.statistics.completionRate}
                                className="w-16"
                              />
                              <span className="text-sm">
                                {comp.statistics.completionRate}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(comp.finances.totalRevenue)}
                          </TableCell>
                          <TableCell
                            className={
                              roi > 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {roi > 0 ? "+" : ""}
                            {roi.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Reports */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu suất hệ thống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Thời gian phản hồi trung bình</span>
                      <span className="font-medium">245ms</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uptime hệ thống</span>
                      <span className="font-medium">99.9%</span>
                    </div>
                    <Progress value={99.9} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tỷ lệ thành công giao dịch</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tương tác người dùng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Người dùng hoạt động hàng ngày</span>
                      <span className="font-medium">1,245</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Thời gian sử dụng trung bình</span>
                      <span className="font-medium">12m 34s</span>
                    </div>
                    <Progress value={65} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tỷ lệ chuyển đổi đăng ký</span>
                      <span className="font-medium">15.2%</span>
                    </div>
                    <Progress value={15.2} />
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
