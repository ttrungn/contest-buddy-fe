import { useMemo, useState } from "react";
import { mockCompetitions } from "@/lib/mockData";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useBalance } from "@/contexts/BalanceContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Wallet, CheckCircle, Receipt, Calendar, RefreshCw } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

// Định nghĩa phí
const FEE_PER_CONTESTANT = 10000; // 10.000đ/thí sinh
const FEE_PER_WEEK = 100000; // 100.000đ/tuần đăng tin

function getWeeksBetween(start: Date, end: Date) {
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil((end.getTime() - start.getTime()) / msPerWeek);
}

export default function OrganizerBilling() {
  const { isAdmin } = useUserRole();
  const { balance, deductBalance } = useBalance();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paidDate, setPaidDate] = useState<Date | null>(null);

  // Giả lập: chỉ hiển thị các cuộc thi do ban tổ chức này tạo (ở đây lấy tất cả)
  const competitions = mockCompetitions;

  // Tính toán phí cho từng cuộc thi
  const billingDetails = useMemo(() =>
    competitions.map((comp) => {
      const weeks = getWeeksBetween(comp.startDate, comp.endDate);
      const contestantFee = comp.participants * FEE_PER_CONTESTANT;
      const timeFee = weeks * FEE_PER_WEEK;
      const total = contestantFee + timeFee;
      return {
        id: comp.id,
        title: comp.title,
        participants: comp.participants,
        startDate: comp.startDate,
        endDate: comp.endDate,
        weeks,
        contestantFee,
        timeFee,
        total,
      };
    }),
    [competitions]
  );

  const totalAmount = billingDetails.reduce((sum, item) => sum + item.total, 0);

  const handlePaymentSuccess = () => {
    // Cập nhật số dư sau khi thanh toán thành công
    deductBalance(totalAmount);
    // Cập nhật trạng thái thanh toán
    setIsPaid(true);
    setPaidAmount(totalAmount);
    setPaidDate(new Date());
  };

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Card className="max-w-xl mx-auto mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Chỉ dành cho Ban tổ chức
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bạn không có quyền truy cập trang này.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quản lý phí dịch vụ</h1>
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Số dư:</span>
            <Badge variant="default" className="bg-green-500">
              {balance.toLocaleString()} VNĐ
            </Badge>
          </div>
        </div>
        {!isPaid ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Phí đăng ký</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Mức phí cho mỗi thí sinh đăng ký</div>
                      <div className="text-muted-foreground text-sm">Áp dụng cho mỗi thí sinh đăng ký tham gia cuộc thi</div>
                    </div>
                    <div className="text-2xl font-bold">{FEE_PER_CONTESTANT.toLocaleString()} đ</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Phí đăng tin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Mức phí cho mỗi tuần đăng tin</div>
                      <div className="text-muted-foreground text-sm">Áp dụng cho mỗi tuần cuộc thi được đăng trên nền tảng</div>
                    </div>
                    <div className="text-2xl font-bold">{FEE_PER_WEEK.toLocaleString()} đ</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết các khoản phí cần thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 border">Cuộc thi</th>
                        <th className="p-2 border">Số thí sinh</th>
                        <th className="p-2 border">Thời gian đăng tin</th>
                        <th className="p-2 border">Phí đăng ký</th>
                        <th className="p-2 border">Phí đăng tin</th>
                        <th className="p-2 border">Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingDetails.map((item) => (
                        <tr key={item.id} className="text-center">
                          <td className="p-2 border font-medium text-left">{item.title}</td>
                          <td className="p-2 border">{item.participants}</td>
                          <td className="p-2 border">{item.weeks} tuần</td>
                          <td className="p-2 border text-right">{item.contestantFee.toLocaleString()} đ</td>
                          <td className="p-2 border text-right">{item.timeFee.toLocaleString()} đ</td>
                          <td className="p-2 border text-right font-bold">{item.total.toLocaleString()} đ</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted font-bold">
                        <td className="p-2 border text-right" colSpan={5}>Tổng cộng</td>
                        <td className="p-2 border text-right text-lg text-primary">{totalAmount.toLocaleString()} đ</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button 
                    size="lg" 
                    className="text-lg"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    Thanh toán
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Payment Success State */}
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  Thanh toán thành công
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Receipt className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Số tiền đã thanh toán</div>
                      <div className="text-xl font-bold text-green-700">{paidAmount.toLocaleString()} VNĐ</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Ngày thanh toán</div>
                      <div className="text-xl font-bold text-green-700">
                        {paidDate?.toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Số dư còn lại</div>
                      <div className="text-xl font-bold text-green-700">{balance.toLocaleString()} VNĐ</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 border">Ngày thanh toán</th>
                        <th className="p-2 border">Số tiền</th>
                        <th className="p-2 border">Phương thức</th>
                        <th className="p-2 border">Trạng thái</th>
                        <th className="p-2 border">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="p-2 border">
                          {paidDate?.toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-2 border text-right font-bold">{paidAmount.toLocaleString()} VNĐ</td>
                        <td className="p-2 border">Điểm tài khoản</td>
                        <td className="p-2 border">
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Thành công
                          </Badge>
                        </td>
                        <td className="p-2 border text-left">Thanh toán phí dịch vụ cuộc thi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsPaid(false);
                      setPaidAmount(0);
                      setPaidDate(null);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Xem các hoá đơn cần thanh toán
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        currentBalance={balance}
        paymentAmount={totalAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
} 