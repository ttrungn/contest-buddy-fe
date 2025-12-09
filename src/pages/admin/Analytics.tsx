import { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import {
  fetchUserTimeRangeStats,
  fetchUserPeriodStats,
  fetchRevenueTimeRangeStats,
  fetchRevenuePeriodStats,
  fetchPlansTimeRangeStats,
  fetchSubscriptionDashboard,
  clearAnalyticsError,
} from "@/services/features/analytics/analyticsSlice";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const dispatch = useAppDispatch();
  const {
    userTimeRange,
    userPeriod,
    revenueTimeRange,
    revenuePeriod,
    plansTimeRange,
    subscriptionDashboard,
    isLoading,
    error,
  } = useAppSelector((state) => state.analytics);

  const [selectedPeriod, setSelectedPeriod] = useState("30 ngày qua");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch data on mount and when period changes
  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();

    switch (selectedPeriod) {
      case "7 ngày qua":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30 ngày qua":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "3 tháng qua":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "1 năm qua":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    dispatch(fetchUserTimeRangeStats({ startDate: startDateStr, endDate: endDateStr }));
    dispatch(fetchRevenueTimeRangeStats({ startDate: startDateStr, endDate: endDateStr }));
    dispatch(fetchPlansTimeRangeStats({ startDate: startDateStr, endDate: endDateStr }));
    dispatch(fetchSubscriptionDashboard(undefined));
  }, [dispatch, selectedPeriod]);

  // Fetch period data for charts (6 months)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    dispatch(fetchUserPeriodStats({ year: currentYear, groupBy: "month" }));
    dispatch(fetchRevenuePeriodStats({ year: currentYear, groupBy: "month" }));
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatCurrencyFull = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      "T1", "T2", "T3", "T4", "T5", "T6",
      "T7", "T8", "T9", "T10", "T11", "T12",
    ];
    return months[month - 1] || `T${month}`;
  };

  // Calculate summary metrics
  const totalRevenue = revenueTimeRange?.totalRevenue || 0;
  const totalOrders = revenueTimeRange?.totalOrders || 0;
  const totalUsers = userTimeRange?.total || 0;
  const totalSubscriptions = subscriptionDashboard?.summary.totalSubscriptions || 0;
  const activeSubscriptions = subscriptionDashboard?.summary.activeSubscriptions || 0;

  // Calculate conversion rate (simplified)
  const conversionRate = totalUsers > 0 ? ((totalSubscriptions / totalUsers) * 100) : 0;

  // Prepare chart data for registration trend (last 6 months)
  const prepareRegistrationTrendData = () => {
    if (!userPeriod) {
      // Return last 6 months with empty data
      const currentMonth = new Date().getMonth() + 1;
      const data = [];
      for (let i = 5; i >= 0; i--) {
        const month = currentMonth - i;
        const monthNum = month <= 0 ? month + 12 : month;
        data.push({
          month: getMonthName(monthNum),
          value: 0,
        });
      }
      return data;
    }

    const currentMonth = new Date().getMonth() + 1;
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const month = currentMonth - i;
      const monthNum = month <= 0 ? month + 12 : month;
      const userItem = userPeriod.users.find((u) => u.month === monthNum);
      data.push({
        month: getMonthName(monthNum),
        value: userItem?.count || 0,
      });
    }
    return data;
  };

  // Prepare chart data for revenue trend (last 6 months)
  const prepareRevenueTrendData = () => {
    if (!revenuePeriod) {
      const currentMonth = new Date().getMonth() + 1;
      const data = [];
      for (let i = 5; i >= 0; i--) {
        const month = currentMonth - i;
        const monthNum = month <= 0 ? month + 12 : month;
        data.push({
          month: getMonthName(monthNum),
          value: 0,
        });
      }
      return data;
    }

    const currentMonth = new Date().getMonth() + 1;
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const month = currentMonth - i;
      const monthNum = month <= 0 ? month + 12 : month;
      const revenueItem = revenuePeriod.periods.find((p) => p.month === monthNum);
      data.push({
        month: getMonthName(monthNum),
        value: revenueItem?.totalRevenue || 0,
      });
    }
    return data;
  };

  const registrationTrend = prepareRegistrationTrendData();
  const revenueTrend = prepareRevenueTrendData();

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
    change?: number;
    changeType?: "up" | "down";
    period?: string;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && changeType && (
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
                <span className="text-xs text-muted-foreground ml-1">{period}</span>
              </div>
            )}
          </div>
          <Icon className={cn("h-8 w-8", color)} />
        </div>
      </CardContent>
    </Card>
  );

  const ChartCard = ({
    title,
    data,
    type = "bar",
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
          <BarChart3 className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end space-x-2 pt-6">
          {data.map((item, index) => {
            const values = data.map((d) => d.value);
            const maxValue = Math.max(...values, 1);
            // Calculate height in pixels (container is h-64 = 256px, minus padding top 24px = 232px)
            const availableHeight = 232;
            const heightPx = maxValue > 0 && item.value > 0
              ? Math.max((item.value / maxValue) * availableHeight, 4)
              : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="text-xs text-muted-foreground mb-1 h-5 flex items-center">
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
                  style={{ height: `${heightPx}px`, minHeight: item.value > 0 ? "4px" : "0px" }}
                />
                <div className="text-xs mt-1 font-medium h-5 flex items-center">{item.month}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => dispatch(clearAnalyticsError())}>
                Xóa lỗi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <SelectItem value="7 ngày qua">7 ngày qua</SelectItem>
                <SelectItem value="30 ngày qua">30 ngày qua</SelectItem>
                <SelectItem value="3 tháng qua">3 tháng qua</SelectItem>
                <SelectItem value="1 năm qua">1 năm qua</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => window.location.reload()} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Làm mới
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất dữ liệu
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
            title="Tổng đăng ký"
            value={totalSubscriptions.toLocaleString()}
            icon={Users}
            color="text-blue-600"
            change={22.5}
            changeType="up"
          />
          <MetricCard
            title="Tỷ lệ chuyển đổi"
            value={`${conversionRate.toFixed(1)}%`}
            icon={Target}
            color="text-purple-600"
            change={3.2}
            changeType="up"
          />
          <MetricCard
            title="Người dùng hoạt động"
            value={activeSubscriptions.toLocaleString()}
            icon={Activity}
            color="text-orange-600"
            change={8.1}
            changeType="down"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="plans">Gói tin đăng</TabsTrigger>
            <TabsTrigger value="subscriptions">Gói thành viên</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Xu hướng đăng ký (6 tháng qua)"
                data={registrationTrend}
                type="bar"
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

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tổng người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalUsers.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {userTimeRange?.newUsers || 0} người dùng mới,{" "}
                    {userTimeRange?.newOrganizers || 0} organizers mới
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tổng đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalOrders.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Từ {revenueTimeRange?.startDate ? new Date(revenueTimeRange.startDate).toLocaleDateString("vi-VN") : ""} đến{" "}
                    {revenueTimeRange?.endDate ? new Date(revenueTimeRange.endDate).toLocaleDateString("vi-VN") : ""}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu trung bình</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {totalOrders > 0
                      ? formatCurrency(totalRevenue / totalOrders)
                      : formatCurrency(0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Trên mỗi đơn hàng
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Người dùng mới</p>
                    <p className="text-2xl font-bold">{userTimeRange?.newUsers || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organizers mới</p>
                    <p className="text-2xl font-bold">{userTimeRange?.newOrganizers || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng cộng</p>
                    <p className="text-2xl font-bold">{userTimeRange?.total || 0}</p>
                  </div>
                </div>
                {userTimeRange && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">
                      Từ {new Date(userTimeRange.startDate).toLocaleDateString("vi-VN")} đến{" "}
                      {new Date(userTimeRange.endDate).toLocaleDateString("vi-VN")}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <ChartCard
              title="Xu hướng đăng ký người dùng (6 tháng qua)"
              data={registrationTrend}
              type="bar"
              color="blue"
              format="number"
            />
          </TabsContent>

          {/* Plans (Gói tin đăng) Tab */}
          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gói tin đăng (theo khoảng thời gian)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng gói đã mua</p>
                    <p className="text-2xl font-bold">{(plansTimeRange?.totalPlansPurchased || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold">{(plansTimeRange?.totalOrders || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số loại gói</p>
                    <p className="text-2xl font-bold">{plansTimeRange?.totalPlanTypes || 0}</p>
                  </div>
                </div>
                {plansTimeRange && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">
                      Từ {new Date(plansTimeRange.startDate).toLocaleDateString("vi-VN")} đến{" "}
                      {new Date(plansTimeRange.endDate).toLocaleDateString("vi-VN")}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {plansTimeRange?.planBreakdown && plansTimeRange.planBreakdown.length > 0 && (
              <ChartCard
                title="Số lượng gói đã mua theo loại"
                data={plansTimeRange.planBreakdown.map((p) => ({ month: p.planName, value: p.totalPurchased }))}
                type="bar"
                color="purple"
                format="number"
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết gói tin đăng</CardTitle>
              </CardHeader>
              <CardContent>
                {plansTimeRange?.planBreakdown && plansTimeRange.planBreakdown.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên gói</TableHead>
                        <TableHead>Tổng đã mua</TableHead>
                        <TableHead>Tổng đơn hàng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plansTimeRange.planBreakdown.map((plan) => (
                        <TableRow key={plan.planId}>
                          <TableCell className="font-medium">{plan.planName}</TableCell>
                          <TableCell>{plan.totalPurchased.toLocaleString()}</TableCell>
                          <TableCell>{plan.totalOrders.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Không có dữ liệu gói tin đăng</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            {subscriptionDashboard && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(subscriptionDashboard.summary.totalRevenue)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {subscriptionDashboard.summary.totalSubscriptions.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {subscriptionDashboard.summary.activeSubscriptions.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {subscriptionDashboard.summary.cancelledSubscriptions.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Hết hạn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {subscriptionDashboard.summary.expiredSubscriptions.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Chi tiết theo gói</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subscriptionDashboard.plans && subscriptionDashboard.plans.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên gói</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Chu kỳ</TableHead>
                            <TableHead>Tổng đăng ký</TableHead>
                            <TableHead>Đang hoạt động</TableHead>
                            <TableHead>Đã hủy</TableHead>
                            <TableHead>Hết hạn</TableHead>
                            <TableHead>Doanh thu</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(subscriptionDashboard.plans || subscriptionDashboard.planMetrics || []).map((plan) => (
                            <TableRow key={plan.plan_id}>
                              <TableCell className="font-medium">{plan.plan_name}</TableCell>
                              <TableCell>
                                {formatCurrencyFull(plan.plan_price)} {plan.plan_currency}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {plan.billing_cycle === "monthly" ? "Tháng" : "Năm"}
                                </Badge>
                              </TableCell>
                              <TableCell>{plan.totalSubscriptions.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-700">
                                  {plan.activeSubscriptions.toLocaleString()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-red-100 text-red-700">
                                  {plan.cancelledSubscriptions.toLocaleString()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-gray-100 text-gray-700">
                                  {plan.expiredSubscriptions.toLocaleString()}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatCurrencyFull(plan.totalRevenue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Không có dữ liệu đăng ký gói</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
            {!subscriptionDashboard && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {isLoading ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
