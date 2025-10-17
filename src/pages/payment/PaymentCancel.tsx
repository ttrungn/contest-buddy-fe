import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCancel() {
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Show cancellation toast
        toast({
            title: "Thanh toán đã bị hủy",
            description: "Bạn có thể thử thanh toán lại sau",
            variant: "destructive",
        });
    }, [toast]);

    const handleRetryPayment = () => {
        // Navigate back to competition management
        navigate("/organizer/competitions");
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-red-600">Thanh toán bị hủy</CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Bạn đã hủy quá trình thanh toán. Không có khoản phí nào được tính.
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <Badge variant="destructive" className="text-sm px-4 py-2">
                            <XCircle className="h-4 w-4 mr-2" />
                            Thanh toán bị hủy
                        </Badge>
                    </div>

                    {/* Information */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-800 mb-2">Thông tin thanh toán</h3>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li>• Không có khoản phí nào được tính</li>
                            <li>• Cuộc thi vẫn ở trạng thái chưa thanh toán</li>
                            <li>• Bạn có thể thử thanh toán lại bất cứ lúc nào</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleRetryPayment}
                            className="w-full"
                            size="lg"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Thử thanh toán lại
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleGoHome}
                            className="w-full"
                            size="lg"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Về trang chủ
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            Nếu bạn gặp vấn đề với thanh toán, vui lòng liên hệ hỗ trợ
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
