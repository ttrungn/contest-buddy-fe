import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { UserSubscriptionPlan } from "@/interfaces/IUserSubscriptionPlan";
import { fetchUserSubscriptionPlans } from "@/services/features/userSubscriptions/userSubscriptionPlansSlice";
import { purchaseSubscription, fetchCurrentSubscription } from "@/services/features/userSubscriptions/userSubscriptionsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Check, Star, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QRCodeSVG } from "qrcode.react";

export default function SubscriptionPlans() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { plans, isLoading: plansLoading } = useAppSelector(
    (s) => s.userSubscriptionPlans,
  );
  const { currentSubscription, isLoading: purchaseLoading } = useAppSelector(
    (s) => s.userSubscriptions,
  );

  const [purchasingPlan, setPurchasingPlan] = useState<UserSubscriptionPlan | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    payment_url: string;
    qr_code: string;
    order_code: string;
    amount: number;
    plan_name: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchUserSubscriptionPlans());
    dispatch(fetchCurrentSubscription());
  }, [dispatch]);

  const handlePurchase = async (plan: UserSubscriptionPlan) => {
    if (currentSubscription?.status === "active") {
      toast({
        title: "Bạn đã có gói đang hoạt động",
        description: "Vui lòng hủy gói hiện tại trước khi đăng ký gói mới",
        variant: "destructive",
      });
      return;
    }

    setPurchasingPlan(plan);
    try {
      const result = await dispatch(
        purchaseSubscription({ plan_id: plan._id }),
      ).unwrap();

      setPaymentData({
        payment_url: result.payment_url,
        qr_code: result.qr_code,
        order_code: result.order_code,
        amount: result.amount,
        plan_name: result.plan_name,
      });
      setPaymentDialogOpen(true);

      // Refresh current subscription after purchase
      setTimeout(() => {
        dispatch(fetchCurrentSubscription());
      }, 2000);
    } catch (e: any) {
      toast({
        title: "Thất bại",
        description: e || "Có lỗi xảy ra khi đăng ký",
        variant: "destructive",
      });
      setPurchasingPlan(null);
    }
  };

  const handleOpenPayment = () => {
    if (paymentData?.payment_url) {
      window.open(paymentData.payment_url, "_blank");
    }
  };

  const activePlans = plans.filter((p) => p.status === "active");

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gói Subscription Premium</h1>
        <p className="text-muted-foreground">
          Chọn gói phù hợp với nhu cầu của bạn để mở khóa tất cả tính năng premium
        </p>
      </div>

      {currentSubscription?.status === "active" && (
        <Alert className="mb-6">
          <AlertDescription>
            Bạn đang sử dụng gói: <strong>{currentSubscription.plan.name}</strong>
            {" "}(Hết hạn: {new Date(currentSubscription.end_date).toLocaleDateString("vi-VN")})
          </AlertDescription>
        </Alert>
      )}

      {plansLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : activePlans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Hiện chưa có gói subscription nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePlans
            .sort((a, b) => a.display_order - b.display_order)
            .map((plan) => {
              const isCurrentPlan =
                currentSubscription?.plan_id === plan._id &&
                currentSubscription?.status === "active";
              const features = plan.features || {};

              return (
                <Card
                  key={plan._id}
                  className={`relative ${plan.popular ? "border-primary shadow-lg" : ""
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Phổ biến
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {plan.currency}
                      </span>
                      <span className="text-sm text-muted-foreground block mt-1">
                        / {plan.billing_cycle === "monthly" ? "tháng" : "năm"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                  </CardContent>
                  <CardFooter>
                    {isCurrentPlan ? (
                      <Button disabled className="w-full" variant="secondary">
                        Đang sử dụng
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handlePurchase(plan)}
                        disabled={purchaseLoading || !!purchasingPlan}
                      >
                        {purchasingPlan?._id === plan._id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Đăng ký ngay"
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      )}

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thanh toán gói {paymentData?.plan_name}</DialogTitle>
            <DialogDescription>
              Vui lòng thanh toán để kích hoạt gói subscription
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {paymentData && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số tiền:</span>
                  <span className="font-semibold">
                    {paymentData.amount.toLocaleString()} VND
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-mono text-sm">{paymentData.order_code}</span>
                </div>
                {paymentData.qr_code && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="border rounded-lg p-4 bg-white">
                      <QRCodeSVG
                        value={paymentData.qr_code}
                        size={192}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center max-w-[240px]">
                      Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Đóng
            </Button>
            <Button onClick={handleOpenPayment} className="w-full sm:w-auto">
              Thanh toán ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

