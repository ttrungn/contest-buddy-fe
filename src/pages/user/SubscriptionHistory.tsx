import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchSubscriptionHistory } from "@/services/features/userSubscriptions/userSubscriptionsSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SubscriptionHistory() {
  const dispatch = useAppDispatch();
  const { history, isLoading, error } = useAppSelector(
    (s) => s.userSubscriptions,
  );

  useEffect(() => {
    dispatch(fetchSubscriptionHistory());
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500 text-white border-transparent">
            Đang hoạt động
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 text-white border-transparent">
            Đang chờ thanh toán
          </Badge>
        );
      case "cancelled":
        return <Badge variant="secondary">Đã hủy</Badge>;
      case "expired":
        return <Badge variant="outline">Hết hạn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Lịch sử Subscription</h1>
        <Link to="/subscriptions">
          <Button variant="outline">Xem các gói</Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {history.length === 0 ? (
        <Alert>
          <AlertDescription>
            Bạn chưa có lịch sử subscription nào.{" "}
            <Link
              to="/subscriptions"
              className="text-primary hover:underline font-medium"
            >
              Đăng ký gói ngay
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách subscriptions</CardTitle>
            <CardDescription>
              Tất cả các gói subscription bạn đã đăng ký
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gói</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày kết thúc</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((sub) => {
                  const plan =
                    typeof sub.plan_id === "object"
                      ? sub.plan_id
                      : sub.plan;
                  return (
                    <TableRow key={sub._id}>
                      <TableCell className="font-medium">
                        {plan.name}
                        {plan.description && (
                          <p className="text-sm text-muted-foreground">
                            {plan.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>
                        {sub.amount_paid.toLocaleString()} {sub.currency}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.start_date).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.end_date).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

