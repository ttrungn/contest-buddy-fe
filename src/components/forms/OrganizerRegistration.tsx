import { useState, useRef } from "react";
import { Trophy, User, Building2, Mail, Lock, Eye, EyeOff, Phone, Globe, MapPin, Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { registerOrganizer, clearError } from "@/services/features/auth/authSlice";
import { OrganizerRegistrationRequest } from "@/interfaces/IAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function OrganizerRegistration() {
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
    const { toast } = useToast();

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate("/");
        return null;
    }

    // Form state
    const [formData, setFormData] = useState<OrganizerRegistrationRequest>({
        user: {
            username: "",
            password: "",
            full_name: "",
            email: "",
        },
        organizer: {
            name: "",
            email: "",
            description: "",
            address: "",
            phone: "",
            website: "",
        },
        avatar: undefined,
    });

    const handleInputChange = (section: 'user' | 'organizer', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File quá lớn",
                    description: "Kích thước file không được vượt quá 5MB",
                    variant: "destructive",
                });
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: "Định dạng file không hợp lệ",
                    description: "Chỉ hỗ trợ các định dạng: JPEG, JPG, PNG, GIF, WEBP",
                    variant: "destructive",
                });
                return;
            }

            setFormData(prev => ({ ...prev, avatar: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        // Validation
        if (!formData.user.username || !formData.user.password || !formData.user.full_name || !formData.user.email) {
            toast({
                title: "Vui lòng điền đầy đủ thông tin cá nhân",
                variant: "destructive",
            });
            return;
        }

        if (!formData.organizer.name || !formData.organizer.email || !formData.organizer.description ||
            !formData.organizer.address || !formData.organizer.phone) {
            toast({
                title: "Vui lòng điền đầy đủ thông tin tổ chức",
                variant: "destructive",
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.user.email) || !emailRegex.test(formData.organizer.email)) {
            toast({
                title: "Email không hợp lệ",
                description: "Vui lòng kiểm tra lại định dạng email",
                variant: "destructive",
            });
            return;
        }

        // Password validation
        if (formData.user.password.length < 6) {
            toast({
                title: "Mật khẩu quá ngắn",
                description: "Mật khẩu phải có ít nhất 6 ký tự",
                variant: "destructive",
            });
            return;
        }

        try {
            const result = await dispatch(registerOrganizer(formData)).unwrap();
            toast({
                title: "Đăng ký tổ chức thành công!",
                description: result.message,
                variant: "default",
            });
            // Redirect to login or verification page
            navigate("/login");
        } catch (error) {
            toast({
                title: "Đăng ký tổ chức thất bại",
                description: error as string,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 flex items-center justify-center p-4 relative">
            {/* Back to Home Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/home")}
                className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground z-10"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Về trang chủ</span>
            </Button>

            <div className="w-full max-w-2xl">
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

                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold">Đăng ký tài khoản tổ chức</h2>
                        <p className="text-sm text-muted-foreground">Tạo tài khoản để tổ chức và quản lý cuộc thi</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={avatarPreview || ""} alt="Avatar preview" />
                                    <AvatarFallback className="text-lg">
                                        <Building2 className="h-10 w-10" />
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="h-3 w-3" />
                                </Button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                Logo tổ chức (Tùy chọn)<br />Tối đa: 5MB
                            </p>
                        </div>

                        {/* User Information */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Người đại diện
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="fullName" className="text-xs">Họ và tên *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            className="pl-10 h-9"
                                            value={formData.user.full_name}
                                            onChange={(e) => handleInputChange('user', 'full_name', e.target.value)}
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="username" className="text-xs">Tên người dùng *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="username"
                                            className="pl-10 h-9"
                                            value={formData.user.username}
                                            onChange={(e) => handleInputChange('user', 'username', e.target.value)}
                                            placeholder="nguyenvana"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="userEmail" className="text-xs">Email cá nhân *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="userEmail"
                                            type="email"
                                            className="pl-10 h-9"
                                            value={formData.user.email}
                                            onChange={(e) => handleInputChange('user', 'email', e.target.value)}
                                            placeholder="nguyen@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-xs">Mật khẩu *</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="pl-10 pr-10 h-9"
                                            value={formData.user.password}
                                            onChange={(e) => handleInputChange('user', 'password', e.target.value)}
                                            placeholder="••••••••"
                                            required
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
                            </div>
                        </div>

                        {/* Organization Information */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Thông tin tổ chức
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="orgName" className="text-xs">Tên tổ chức *</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="orgName"
                                            className="pl-10 h-9"
                                            value={formData.organizer.name}
                                            onChange={(e) => handleInputChange('organizer', 'name', e.target.value)}
                                            placeholder="Công ty ABC"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="orgEmail" className="text-xs">Email tổ chức *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="orgEmail"
                                            type="email"
                                            className="pl-10 h-9"
                                            value={formData.organizer.email}
                                            onChange={(e) => handleInputChange('organizer', 'email', e.target.value)}
                                            placeholder="contact@company.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="phone" className="text-xs">Số điện thoại *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            className="pl-10 h-9"
                                            value={formData.organizer.phone}
                                            onChange={(e) => handleInputChange('organizer', 'phone', e.target.value)}
                                            placeholder="0123456789"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="website" className="text-xs">Website</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="website"
                                            className="pl-10 h-9"
                                            value={formData.organizer.website}
                                            onChange={(e) => handleInputChange('organizer', 'website', e.target.value)}
                                            placeholder="https://company.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="address" className="text-xs">Địa chỉ *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="address"
                                        className="pl-10 h-9"
                                        value={formData.organizer.address}
                                        onChange={(e) => handleInputChange('organizer', 'address', e.target.value)}
                                        placeholder="123 Đường ABC, Quận XYZ"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-xs">Mô tả tổ chức *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.organizer.description}
                                    onChange={(e) => handleInputChange('organizer', 'description', e.target.value)}
                                    placeholder="Mô tả về tổ chức, lĩnh vực hoạt động..."
                                    className="min-h-[60px] text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Đang đăng ký..." : "Đăng ký tài khoản tổ chức"}
                        </Button>
                    </form>

                    {/* Terms and Login Link */}
                    <div className="mt-4 space-y-2">
                        <p className="text-xs text-muted-foreground text-center">
                            Bằng việc đăng ký, bạn đồng ý với{" "}
                            <a href="#" className="text-primary hover:underline">
                                Điều khoản sử dụng
                            </a>{" "}
                            và{" "}
                            <a href="#" className="text-primary hover:underline">
                                Chính sách bảo mật
                            </a>
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                            Tài khoản sẽ được xem xét trong vòng 24-48 giờ
                        </p>
                        <p className="text-sm text-muted-foreground text-center">
                            Đã có tài khoản?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto text-primary hover:underline text-sm"
                                onClick={() => navigate("/login")}
                            >
                                Đăng nhập ngay
                            </Button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}