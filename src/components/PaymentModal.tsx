import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Wallet, 
  CheckCircle, 
  AlertCircle,
  Coins,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  paymentAmount: number;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  currentBalance,
  paymentAmount,
  onPaymentSuccess,
}: PaymentModalProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [usePoints, setUsePoints] = useState(true);
  const [customAmount, setCustomAmount] = useState(paymentAmount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Thanh toán thành công!",
        description: `Đã thanh toán ${formatCurrency(customAmount)} từ tài khoản của bạn.`,
        action: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
      
      onPaymentSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Thanh toán thất bại!",
        description: "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.",
        variant: "destructive",
        action: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const canPay = usePoints ? customAmount <= currentBalance : true;
  const remainingBalance = currentBalance - customAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Thanh toán
          </DialogTitle>
          <DialogDescription>
            Sử dụng điểm trong tài khoản để thanh toán
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Số dư hiện tại:</span>
              </div>
              <Badge variant="default" className="bg-green-500">
                <Coins className="h-3 w-3 mr-1" />
                {formatCurrency(currentBalance)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Phương thức thanh toán</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="use-points"
                  name="payment-method"
                  checked={usePoints}
                  onChange={() => setUsePoints(true)}
                  className="h-4 w-4"
                />
                <Label htmlFor="use-points" className="flex items-center cursor-pointer">
                  <Coins className="h-4 w-4 mr-2 text-green-600" />
                  Sử dụng điểm tài khoản
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="external-payment"
                  name="payment-method"
                  checked={!usePoints}
                  onChange={() => setUsePoints(false)}
                  className="h-4 w-4"
                />
                <Label htmlFor="external-payment" className="flex items-center cursor-pointer">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                  Thanh toán bên ngoài
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền thanh toán</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                placeholder="Nhập số tiền"
                className="pr-20"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                VNĐ
              </div>
            </div>
            {usePoints && customAmount > currentBalance && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Số dư không đủ để thanh toán
              </p>
            )}
          </div>

          {/* Payment Summary */}
          {usePoints && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Số dư trước thanh toán:</span>
                <span className="font-medium">{formatCurrency(currentBalance)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Số tiền thanh toán:</span>
                <span className="font-medium text-red-600">-{formatCurrency(customAmount)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>Số dư sau thanh toán:</span>
                <span className={remainingBalance >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(Math.max(0, remainingBalance))}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Hủy
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing || !canPay}
            className="flex items-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Xác nhận thanh toán
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 