import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchOrders } from "@/services/features/orders/ordersSlice";
import { Order, OrderStatus } from "@/interfaces/IOrder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Receipt,
    Calendar,
    DollarSign,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaginationShadcn from "@/components/ui/pagination-shadcn";

export default function PaymentHistory() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orders, isLoading, error } = useAppSelector((state) => state.orders);

    // Frontend pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleViewDetail = (order: Order) => {
        navigate(`/organizer/payment-history/${order.id}`);
    };

    // Frontend pagination logic
    const totalItems = orders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (limit: number) => {
        setItemsPerPage(limit);
        setCurrentPage(1); // Reset to first page when limit changes
    };

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

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Đang tải lịch sử thanh toán...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Lỗi tải dữ liệu</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => dispatch(fetchOrders())}>
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Lịch sử thanh toán</h1>
                </div>
                <p className="text-muted-foreground">
                    Xem lại tất cả các giao dịch thanh toán của bạn
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có giao dịch nào</h3>
                    <p className="text-muted-foreground">
                        Bạn chưa có giao dịch thanh toán nào trong hệ thống
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {paginatedOrders.map((order) => (
                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Receipt className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {formatOrderNumber(order.order_number)}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {order.notes}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Badge className={cn("text-xs", getStatusColor(order.status))}>
                                            <div className="flex items-center space-x-1">
                                                {getStatusIcon(order.status)}
                                                <span>{getStatusLabel(order.status)}</span>
                                            </div>
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetail(order)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Tổng tiền</p>
                                            <p className="font-semibold">
                                                {formatCurrency(order.total_amount, order.currency)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Ngày đặt</p>
                                            <p className="font-semibold">
                                                {formatDate(order.order_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Cập nhật</p>
                                            <p className="font-semibold">
                                                {formatDate(order.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {orders.length > 0 && (
                <PaginationShadcn
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showItemsPerPage={true}
                    showInfo={true}
                    maxVisiblePages={5}
                    className="mt-6"
                    previousLabel="Trước"
                    nextLabel="Sau"
                    itemsPerPageOptions={[5, 10, 20, 50]}
                    infoTemplate="Hiển thị {start} - {end} trong tổng số {total} đơn hàng"
                />
            )}

        </div>
    );
}
