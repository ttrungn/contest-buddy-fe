import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import {
  fetchCurrentSubscription,
  cancelSubscription,
} from "@/services/features/userSubscriptions/userSubscriptionsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, CreditCard, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function MySubscription() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { currentSubscription, isLoading, error } = useAppSelector(
    (s) => s.userSubscriptions,
  );

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentSubscription());
  }, [dispatch]);

  const handleCancel = async () => {
    if (!currentSubscription) return;

    setIsCancelling(true);
    try {
      await dispatch(
        cancelSubscription({
          subscriptionId: currentSubscription._id,
          reason: cancelReason || undefined,
        }),
      ).unwrap();

      toast({
        title: "Đã hủy subscription",
        description: "Gói subscription của bạn đã được hủy thành công",
      });

      setCancelDialogOpen(false);
      setCancelReason("");
      dispatch(fetchCurrentSubscription());
    } catch (e: any) {
      toast({
        title: "Hủy thất bại",
        description: e || "Có lỗi xảy ra khi hủy subscription",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

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

  if (!currentSubscription) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Gói Subscription của tôi</h1>
        <Alert>
          <AlertDescription>
            Bạn chưa có gói subscription nào.{" "}
            <Link
              to="/subscriptions"
              className="text-primary hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const features = currentSubscription.features || {};

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Gói Subscription của tôi</h1>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                {currentSubscription.plan.name}
              </CardTitle>
              <CardDescription>
                {currentSubscription.plan.description}
              </CardDescription>
            </div>
            {getStatusBadge(currentSubscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Giá</p>
                <p className="font-semibold">
                  {currentSubscription.amount_paid.toLocaleString()}{" "}
                  {currentSubscription.currency}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Chu kỳ thanh toán</p>
                <p className="font-semibold capitalize">
                  {currentSubscription.plan.billing_cycle}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                <p className="font-semibold">
                  {new Date(currentSubscription.start_date).toLocaleDateString(
                    "vi-VN",
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày hết hạn</p>
                <p className="font-semibold">
                  {new Date(currentSubscription.end_date).toLocaleDateString(
                    "vi-VN",
                  )}
                </p>
              </div>
            </div>
          </div>

          {currentSubscription.status === "active" && (
            <>
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Tính năng Premium</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {features.max_daily_reminders || 20} nhắc nhở mỗi ngày
                    </span>
                  </div>
                  {features.priority_support && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Hỗ trợ ưu tiên</span>
                    </div>
                  )}
                  {features.export_history && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Xuất lịch sử</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Theo dõi tối đa {features.max_followed_contests || 100} cuộc thi
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button
                  variant="destructive"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Hủy subscription
                </Button>
              </div>
            </>
          )}

          {currentSubscription.cancelled_reason && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Lý do hủy:</strong> {currentSubscription.cancelled_reason}
                {currentSubscription.cancelled_at && (
                  <span className="block mt-1 text-xs opacity-75">
                    Hủy vào:{" "}
                    {new Date(
                      currentSubscription.cancelled_at,
                    ).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link to="/subscriptions">
          <Button variant="outline">Xem các gói khác</Button>
        </Link>
        <Link to="/subscriptions/history">
          <Button variant="outline">Xem lịch sử</Button>
        </Link>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy subscription</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn hủy gói subscription này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reason">Lý do hủy (tùy chọn)</Label>
              <Textarea
                id="reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy subscription..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason("");
              }}
              disabled={isCancelling}
            >
              Không
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang hủy...
                </>
              ) : (
                "Xác nhận hủy"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

