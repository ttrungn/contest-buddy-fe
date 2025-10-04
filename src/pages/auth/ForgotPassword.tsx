import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { forgotPassword, clearError } from "@/services/features/auth/authSlice";
import { Mail, ArrowLeft, CheckCircle, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập địa chỉ email",
                variant: "destructive",
            });
            return;
        }

        try {
            const result = await dispatch(forgotPassword({ email })).unwrap();

            if (result.success) {
                setIsSuccess(true);
                toast({
                    title: "Thành công!",
                    description: "Email reset mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
                });
            } else {
                toast({
                    title: "Lỗi",
                    description: result.message || "Không thể gửi email reset mật khẩu",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error || "Đã xảy ra lỗi khi gửi email",
                variant: "destructive",
            });
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white shadow-2xl rounded-2xl p-8 border border-green-100">
                        {/* Logo */}
                        <div className="mb-8">
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">CB</span>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-700">Contest Buddy</h2>
                        </div>

                        {/* Success Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Email đã được gửi!
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Chúng tôi đã gửi hướng dẫn reset mật khẩu đến <strong>{email}</strong>.
                            Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Lưu ý:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Kiểm tra cả thư mục spam/junk</li>
                                        <li>• Email có thể mất vài phút để đến</li>
                                        <li>• Link reset có thời hạn 1 giờ</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => window.open('https://gmail.com', '_blank')}
                                className="w-full"
                                variant="outline"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Mở Gmail
                            </Button>

                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full"
                            >
                                Quay lại đăng nhập
                            </Button>
                        </div>

                        {/* Resend option */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-3">
                                Không nhận được email?
                            </p>
                            <Button
                                onClick={() => setIsSuccess(false)}
                                variant="ghost"
                                className="text-sm"
                            >
                                Gửi lại email khác
                            </Button>
                        </div>

                        {/* Back to home link */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <Link
                                to="/"
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                ← Quay về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button
                            onClick={() => navigate('/login')}
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại đăng nhập
                        </Button>
                    </div>

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">CB</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-700">Contest Buddy</h2>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                            <KeyRound className="w-8 h-8 text-orange-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Quên mật khẩu?
                        </h1>
                        <p className="text-gray-600">
                            Nhập email để nhận hướng dẫn reset mật khẩu
                        </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Nhập địa chỉ email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <KeyRound className="w-4 h-4 mr-2" />
                                    Gửi email reset mật khẩu
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Hướng dẫn:
                        </h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Nhập email bạn đã dùng để đăng ký tài khoản</li>
                            <li>• Kiểm tra cả thư mục spam nếu không thấy email</li>
                            <li>• Link reset mật khẩu có hiệu lực trong 1 giờ</li>
                            <li>• Liên hệ hỗ trợ nếu vẫn gặp vấn đề</li>
                        </ul>
                    </div>

                    {/* Other options */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 mb-3">
                            Nhớ lại mật khẩu?
                        </p>
                        <Button
                            onClick={() => navigate('/login')}
                            variant="ghost"
                            className="text-sm"
                        >
                            Đăng nhập ngay
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link
                            to="/"
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Quay về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}