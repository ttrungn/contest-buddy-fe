import { useState, useEffect } from "react";
import { Trophy, User, Building2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { registerUser, loginUser, clearError } from "@/services/features/auth/authSlice";
import { RegisterRequest, LoginRequest } from "@/interfaces/IAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
    initialMode?: "login" | "register";
}

export default function AuthLayout({ initialMode = "login" }: AuthLayoutProps) {
    const [mode, setMode] = useState<"login" | "register">(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated, needsVerification, verificationEmail } = useAppSelector((state) => state.auth);
    const { toast } = useToast();

    // Check for needsVerification and redirect
    useEffect(() => {
        if (needsVerification && verificationEmail) {
            toast({
                title: "Email chưa được xác thực",
                description: "Bạn cần xác thực email trước khi đăng nhập",
                variant: "destructive",
            });
            navigate('/resend-verification', {
                state: { email: verificationEmail }
            });
        }
    }, [needsVerification, verificationEmail, navigate, toast]);

    // Register form state
    const [registerData, setRegisterData] = useState<RegisterRequest>({
        username: "",
        password: "",
        full_name: "",
        email: "",
        school: "",
        city: "",
        region: "",
        country: "Vietnam",
        study_field: "",
    });

    // Login form state
    const [loginData, setLoginData] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        try {
            const result = await dispatch(registerUser(registerData)).unwrap();
            toast({
                title: "Đăng ký thành công!",
                description: result.message,
                variant: "default",
            });
            setMode("login");
        } catch (error) {
            toast({
                title: "Đăng ký thất bại",
                description: error as string,
                variant: "destructive",
            });
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        try {
            const result = await dispatch(loginUser(loginData)).unwrap();
            toast({
                title: "Đăng nhập thành công!",
                description: result.message,
                variant: "default",
            });
            // Redirect to home page or dashboard
            window.location.href = "/";
        } catch (error: any) {
            // Handle error properly - error is an object with message property
            let errorMessage = "Đăng nhập thất bại";

            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object') {
                errorMessage = error.message || errorMessage;
            }

            toast({
                title: "Đăng nhập thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (mode === "register") {
            setRegisterData(prev => ({ ...prev, [field]: value }));
        } else {
            setLoginData(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 flex items-center justify-center p-4 relative">
            {/* Back to Home Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/"}
                className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground z-10"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Về trang chủ</span>
            </Button>

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Trophy className="h-7 w-7" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">Contest Buddy</span>
                    </div>
                    <p className="text-muted-foreground">Nền tảng cuộc thi hàng đầu Việt Nam</p>
                </div>

                {/* Auth Form */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Tab Navigation */}
                    <div className="flex mb-6">
                        <button
                            type="button"
                            onClick={() => setMode("login")}
                            className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg transition-colors ${mode === "login"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            Đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("register")}
                            className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg transition-colors ${mode === "register"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            Đăng ký
                        </button>
                    </div>

                    {mode === "register" ? (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold">Tạo tài khoản mới</h2>
                                <p className="text-sm text-muted-foreground">Tham gia cộng đồng hơn 15,000 thành viên</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="lastName">Họ</Label>
                                    <Input
                                        id="lastName"
                                        value={registerData.full_name.split(' ')[0] || ''}
                                        onChange={(e) => {
                                            const lastName = e.target.value;
                                            const firstName = registerData.full_name.split(' ').slice(1).join(' ');
                                            handleInputChange('full_name', `${lastName} ${firstName}`.trim());
                                        }}
                                        placeholder="Nguyễn"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="firstName">Tên</Label>
                                    <Input
                                        id="firstName"
                                        value={registerData.full_name.split(' ').slice(1).join(' ') || ''}
                                        onChange={(e) => {
                                            const firstName = e.target.value;
                                            const lastName = registerData.full_name.split(' ')[0];
                                            handleInputChange('full_name', `${lastName} ${firstName}`.trim());
                                        }}
                                        placeholder="Văn A"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="username">Tên người dùng</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        className="pl-10"
                                        value={registerData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        placeholder="nguyenvana"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="pl-10"
                                        value={registerData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="school">Trường học</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="school"
                                        className="pl-10"
                                        value={registerData.school}
                                        onChange={(e) => handleInputChange('school', e.target.value)}
                                        placeholder="Đại học Bách Khoa Hà Nội"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="city">Thành phố</Label>
                                    <Input
                                        id="city"
                                        value={registerData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        placeholder="VD: Hà Nội"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="region">Khu vực</Label>
                                    <Input
                                        id="region"
                                        value={registerData.region}
                                        onChange={(e) => handleInputChange('region', e.target.value)}
                                        placeholder="VD: Bắc Bộ"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="studyField">Chuyên ngành</Label>
                                <Input
                                    id="studyField"
                                    value={registerData.study_field}
                                    onChange={(e) => handleInputChange('study_field', e.target.value)}
                                    placeholder="Công nghệ thông tin"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Mật khẩu</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                        value={registerData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold">Đăng nhập</h2>
                                <p className="text-sm text-muted-foreground">Chào mừng bạn quay trở lại!</p>
                            </div>

                            <div>
                                <Label htmlFor="loginEmail">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="loginEmail"
                                        type="email"
                                        className="pl-10"
                                        value={loginData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="loginPassword">Mật khẩu</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="loginPassword"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                        value={loginData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </Button>

                            {/* Forgot Password Link */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Terms and Conditions for Register */}
                    {mode === "register" && (
                        <div className="mt-4 text-center">
                            <p className="text-xs text-muted-foreground">
                                Bằng việc đăng ký, bạn đồng ý với{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Điều khoản sử dụng
                                </a>{" "}
                                và{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Chính sách bảo mật
                                </a>
                            </p>
                        </div>
                    )}

                    {/* Organizer Registration CTA */}
                    {!isAuthenticated && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                            <div className="text-center space-y-3">
                                <div className="flex items-center justify-center">
                                    <Building2 className="h-8 w-8 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Bạn muốn đăng ký ban tổ chức?
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Tạo tài khoản tổ chức để tổ chức và quản lý các cuộc thi chuyên nghiệp
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full bg-white border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                                    onClick={() => navigate("/register/organizer")}
                                >
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Đăng ký tài khoản tổ chức
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
