import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector, persistor } from "@/services/store/store";
import { resendVerification, clearError, logout } from "@/services/features/auth/authSlice";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { tokenUtils } from "@/services/constant/axiosInstance";

export default function ResendVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const { toast } = useToast();

    // Get email from location state if available (from failed login)
    const [email, setEmail] = useState(location.state?.email || '');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleExit = async (path: string) => {
        try {
            dispatch(logout());
            tokenUtils.clearTokens();
            await persistor.purge();
            localStorage.removeItem('persist:root');
        } finally {
            navigate(path, { replace: true });
        }
    };

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
            const result = await dispatch(resendVerification({ email })).unwrap();

            if (result.success) {
                setIsSuccess(true);
                toast({
                    title: "Thành công!",
                    description: "Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
                });
            } else {
                toast({
                    title: "Lỗi",
                    description: result.message || "Không thể gửi email xác thực",
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
                            Chúng tôi đã gửi email xác thực đến <strong>{email}</strong>.
                            Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để xác thực tài khoản.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Lưu ý:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Kiểm tra cả thư mục spam/junk</li>
                                        <li>• Email có thể mất vài phút để đến</li>
                                        <li>• Link xác thực có thời hạn 24 giờ</li>
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
                                onClick={() => handleExit('/login')}
                                className="w-full"
                            >
                                Quay lại đăng nhập
                            </Button>
                        </div>


                        {/* Back to home link */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <Link
                                to="/"
                                onClick={(e) => { e.preventDefault(); handleExit('/'); }}
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
                            onClick={() => handleExit('/login')}
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
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Gửi lại email xác thực
                        </h1>
                        <p className="text-gray-600">
                            {email ?
                                `Gửi email xác thực đến ${email}` :
                                "Nhập email để nhận liên kết xác thực mới"
                            }
                        </p>
                    </div>


                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">


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
                                    <Mail className="w-4 h-4 mr-2" />
                                    Gửi email xác thực
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Lưu ý quan trọng:
                        </h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Email xác thực sẽ được gửi đến địa chỉ bạn đã đăng ký</li>
                            <li>• Kiểm tra cả thư mục spam nếu không thấy email</li>
                            <li>• Liên kết xác thực có hiệu lực trong 24 giờ</li>
                            <li>• Liên hệ hỗ trợ nếu vẫn gặp vấn đề</li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link
                            to="/"
                            onClick={(e) => { e.preventDefault(); handleExit('/'); }}
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