import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchOrderDetail, clearCurrentOrder } from "@/services/features/orders/ordersSlice";
import { OrderStatus } from "@/interfaces/IOrder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Receipt,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    CreditCard,
    MapPin,
    Trophy,
    Users,
    ExternalLink,
    FileText,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaymentDetail() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentOrder, orderDetails, competitionInfo, isLoading, error } = useAppSelector(
        (state) => state.orders
    );

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetail(orderId));
        }

        // Cleanup when component unmounts
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [orderId, dispatch]);

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "cancelled":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "failed":
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            case "failed":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case "completed":
                return "Hoàn thành";
            case "pending":
                return "Chờ xử lý";
            case "cancelled":
                return "Đã hủy";
            case "failed":
                return "Thất bại";
            default:
                return status;
        }
    };

    const formatCurrency = (amount: number, currency: string = "VND") => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const formatOrderNumber = (orderNumber: string) => {
        return `#${orderNumber}`;
    };

    const handleGoBack = () => {
        navigate("/organizer/payment-history");
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Đang tải chi tiết đơn hàng...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !currentOrder) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-600 mb-2">
                        {error || "Không tìm thấy đơn hàng"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Đơn hàng không tồn tại hoặc đã bị xóa
                    </p>
                    <Button onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                    <Button variant="outline" onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <div className="flex items-center space-x-3">
                        <Receipt className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
                            <p className="text-muted-foreground">
                                {formatOrderNumber(currentOrder.order_number)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">
                                    {formatOrderNumber(currentOrder.order_number)}
                                </CardTitle>
                                <p className="text-muted-foreground mt-1">
                                    {currentOrder.notes}
                                </p>
                            </div>
                            <Badge className={cn("text-sm", getStatusColor(currentOrder.status))}>
                                <div className="flex items-center space-x-1">
                                    {getStatusIcon(currentOrder.status)}
                                    <span>{getStatusLabel(currentOrder.status)}</span>
                                </div>
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng tiền</p>
                                    <p className="font-semibold text-lg">
                                        {formatCurrency(currentOrder.total_amount, currentOrder.currency)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Ngày đặt</p>
                                    <p className="font-semibold">
                                        {formatDate(currentOrder.order_date)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Cập nhật</p>
                                    <p className="font-semibold">
                                        {formatDate(currentOrder.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Competition Information */}
                {competitionInfo && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Trophy className="h-5 w-5 text-primary" />
                                <span>Thông tin cuộc thi</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{competitionInfo.title}</h3>
                                    <p className="text-muted-foreground">{competitionInfo.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Địa điểm</p>
                                            <p className="font-semibold">{competitionInfo.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Số người tham gia</p>
                                            <p className="font-semibold">
                                                {competitionInfo.participants_count} / {competitionInfo.max_participants}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Giải thưởng</p>
                                            <p className="font-semibold">{competitionInfo.prize_pool_text}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Hạn đăng ký</p>
                                            <p className="font-semibold">
                                                {formatDate(competitionInfo.registration_deadline)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {competitionInfo.website && (
                                    <div className="pt-4">
                                        <Button variant="outline" asChild>
                                            <a
                                                href={competitionInfo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                <span>Xem website cuộc thi</span>
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Order Details */}
                {orderDetails.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <span>Chi tiết sản phẩm</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orderDetails.map((detail, index) => (
                                    <div key={detail.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold">{detail.product_description}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Số lượng: {detail.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {formatCurrency(detail.final_price, currentOrder.currency)}
                                                </p>
                                                {detail.discount_per_item > 0 && (
                                                    <p className="text-sm text-green-600">
                                                        Giảm giá: {formatCurrency(detail.discount_per_item, currentOrder.currency)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm text-muted-foreground">
                                                Đơn giá: {formatCurrency(detail.unit_price, currentOrder.currency)}
                                            </span>
                                            <span className="font-semibold">
                                                Tổng: {formatCurrency(detail.total_price, currentOrder.currency)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        </div>
    );
}
