import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Trophy, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    const [paymentData, setPaymentData] = useState<{
        amount?: number;
        orderCode?: string;
        competitionTitle?: string;
    }>({});

    useEffect(() => {
        // Get payment data from URL params
        const amount = searchParams.get('amount');
        const orderCode = searchParams.get('orderCode');
        const competitionTitle = searchParams.get('competitionTitle');

        setPaymentData({
            amount: amount ? parseInt(amount) : undefined,
            orderCode: orderCode || undefined,
            competitionTitle: competitionTitle || undefined,
        });

        // Show success toast
        toast({
            title: "Thanh toán thành công!",
            description: "Cảm ơn bạn đã thanh toán. Cuộc thi đã được kích hoạt.",
        });
    }, [searchParams, toast]);

    const handleViewCompetition = () => {
        // Navigate to competition management
        navigate("/organizer/competitions");
    };

    const handleGoHome = () => {
        navigate("/");
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-green-600">Thanh toán thành công!</CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Cảm ơn bạn đã thanh toán. Cuộc thi của bạn đã được kích hoạt.
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Success Badge */}
                    <div className="flex justify-center">
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-sm px-4 py-2">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Thanh toán hoàn tất
                        </Badge>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-3">Chi tiết thanh toán</h3>
                        <div className="space-y-2 text-sm">
                            {paymentData.amount && (
                                <div className="flex justify-between">
                                    <span className="text-green-700">Số tiền:</span>
                                    <span className="font-semibold text-green-800">
                                        {formatCurrency(paymentData.amount)}
                                    </span>
                                </div>
                            )}
                            {paymentData.orderCode && (
                                <div className="flex justify-between">
                                    <span className="text-green-700">Mã đơn hàng:</span>
                                    <span className="font-mono text-green-800">
                                        {paymentData.orderCode}
                                    </span>
                                </div>
                            )}
                            {paymentData.competitionTitle && (
                                <div className="flex justify-between">
                                    <span className="text-green-700">Cuộc thi:</span>
                                    <span className="font-semibold text-green-800 text-right">
                                        {paymentData.competitionTitle}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                            <Trophy className="h-4 w-4 mr-2" />
                            Bước tiếp theo
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Cuộc thi đã được kích hoạt</li>
                            <li>• Bạn có thể quản lý cuộc thi trong dashboard</li>
                            <li>• Thí sinh có thể bắt đầu đăng ký</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleViewCompetition}
                            className="w-full"
                            size="lg"
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Quản lý cuộc thi
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleGoHome}
                            className="w-full"
                            size="lg"
                        >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Về trang chủ
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            Bạn sẽ nhận được email xác nhận thanh toán trong vài phút tới
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
