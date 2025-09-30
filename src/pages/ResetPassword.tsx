import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { resetPassword, clearError } from "@/services/features/auth/authSlice";
import { Eye, EyeOff, Lock, CheckCircle, Loader2, KeyRound, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const { toast } = useToast();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [tokenError, setTokenError] = useState(false);

    // Extract token from URL params or query string
    const resetToken = token || searchParams.get('token');

    useEffect(() => {
        if (!resetToken) {
            setTokenError(true);
        }
        dispatch(clearError());
    }, [resetToken, dispatch]);

    const validatePassword = (pwd: string) => {
        if (pwd.length < 6) {
            return "Mật khẩu phải có ít nhất 6 ký tự";
        }
        if (!/(?=.*[a-zA-Z])/.test(pwd)) {
            return "Mật khẩu phải chứa ít nhất 1 chữ cái";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resetToken) {
            toast({
                title: "Lỗi",
                description: "Token reset không hợp lệ",
                variant: "destructive",
            });
            return;
        }

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            toast({
                title: "Lỗi",
                description: passwordError,
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Lỗi",
                description: "Mật khẩu xác nhận không khớp",
                variant: "destructive",
            });
            return;
        }

        try {
            const result = await dispatch(resetPassword({
                token: resetToken,
                newPassword: password
            })).unwrap();

            if (result.success) {
                setIsSuccess(true);
                toast({
                    title: "Thành công!",
                    description: "Mật khẩu đã được reset thành công",
                });
            } else {
                toast({
                    title: "Lỗi",
                    description: result.message || "Không thể reset mật khẩu",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error || "Đã xảy ra lỗi khi reset mật khẩu",
                variant: "destructive",
            });
        }
    };

    // Token error screen
    if (tokenError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white shadow-2xl rounded-2xl p-8 border border-red-100">
                        {/* Logo */}
                        <div className="mb-8">
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">CB</span>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-700">Contest Buddy</h2>
                        </div>

                        {/* Error Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Link không hợp lệ
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Link reset mật khẩu không hợp lệ hoặc đã hết hạn.
                            Vui lòng yêu cầu reset mật khẩu mới.
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate('/forgot-password')}
                                className="w-full"
                            >
                                <KeyRound className="w-4 h-4 mr-2" />
                                Gửi lại yêu cầu reset
                            </Button>

                            <Button
                                onClick={() => navigate('/login')}
                                variant="outline"
                                className="w-full"
                            >
                                Quay lại đăng nhập
                            </Button>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => navigate('/')}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                ← Quay về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success screen
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
                            Mật khẩu đã được reset!
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Mật khẩu của bạn đã được thay đổi thành công.
                            Bây giờ bạn có thể đăng nhập với mật khẩu mới.
                        </p>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div className="text-sm text-green-800">
                                    <p className="font-medium mb-1">Hoàn thành:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Mật khẩu đã được cập nhật an toàn</li>
                                        <li>• Tất cả phiên đăng nhập cũ đã bị hủy</li>
                                        <li>• Tài khoản của bạn đã được bảo mật</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full"
                            >
                                Đăng nhập ngay
                            </Button>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => navigate('/')}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                ← Quay về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Reset password form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
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
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Tạo mật khẩu mới
                        </h1>
                        <p className="text-gray-600">
                            Nhập mật khẩu mới cho tài khoản của bạn
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
                            <Label htmlFor="password">Mật khẩu mới</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu mới"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Password requirements */}
                        {password && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    Yêu cầu mật khẩu:
                                </h3>
                                <div className="space-y-1">
                                    <div className={`flex items-center text-xs ${password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-3 h-3 mr-2 ${password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`} />
                                        Ít nhất 6 ký tự
                                    </div>
                                    <div className={`flex items-center text-xs ${/(?=.*[a-zA-Z])/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-3 h-3 mr-2 ${/(?=.*[a-zA-Z])/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                                        Chứa ít nhất 1 chữ cái
                                    </div>
                                    <div className={`flex items-center text-xs ${password === confirmPassword && password ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-3 h-3 mr-2 ${password === confirmPassword && password ? 'text-green-600' : 'text-gray-400'}`} />
                                        Mật khẩu xác nhận khớp
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Cập nhật mật khẩu
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">
                            Lưu ý bảo mật:
                        </h3>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Chọn mật khẩu mạnh và khó đoán</li>
                            <li>• Không chia sẻ mật khẩu với ai khác</li>
                            <li>• Tất cả phiên đăng nhập cũ sẽ bị hủy</li>
                            <li>• Đăng xuất khỏi tất cả thiết bị khác</li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Quay về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}