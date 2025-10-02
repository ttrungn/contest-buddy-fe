import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchOrganizerProfile, updateOrganizerProfile, uploadOrganizerAvatar } from "@/services/features/organizer/organizerSlice";

interface OrganizerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  foundedDate: string;
  memberCount: number;
  verified: boolean;
  logo: string;
}

export default function OrganizerProfile() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { profile, isLoading } = useAppSelector((s) => s.organizer);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [organizerInfo, setOrganizerInfo] = useState<OrganizerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    foundedDate: "",
    memberCount: 0,
    verified: false,
    logo: "/placeholder.svg",
  });

  const [formData, setFormData] = useState<OrganizerInfo>(organizerInfo);

  // Fetch organizer profile on mount
  useEffect(() => {
    dispatch(fetchOrganizerProfile()).unwrap().catch(() => {
      toast({ title: "Lỗi", description: "Không tải được hồ sơ ban tổ chức", variant: "destructive" });
    });
  }, [dispatch, toast]);

  // Sync store profile to local UI states
  useEffect(() => {
    if (profile) {
      const mapped: OrganizerInfo = {
        name: profile.organizerName || "",
        email: profile.organizerEmail || profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        website: profile.website || "",
        description: profile.description || "",
        foundedDate: "",
        memberCount: 0,
        verified: true,
        logo: profile.avatar_url || "/placeholder.svg",
      };
      setOrganizerInfo(mapped);
      setFormData(mapped);
    }
  }, [profile]);

  const handleInputChange = (field: keyof OrganizerInfo, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(
        updateOrganizerProfile({
          name: formData.name,
          email: formData.email,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          website: formData.website,
          full_name: profile?.full_name,
        }),
      ).unwrap();

      setOrganizerInfo(formData);
      setIsEditing(false);
      toast({
        title: "Thành công!",
        description: "Thông tin ban tổ chức đã được cập nhật.",
        action: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
    } catch (error: any) {
      toast({
        title: "Lỗi!",
        description: error || "Không thể cập nhật thông tin. Vui lòng thử lại.",
        variant: "destructive",
        action: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onPickLogo = () => fileInputRef.current?.click();
  const onLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(uploadOrganizerAvatar(file)).unwrap();
      toast({ title: "Đã cập nhật logo" });
    } catch (error: any) {
      toast({ title: "Upload thất bại", description: String(error), variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setFormData(organizerInfo);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Thông tin Ban tổ chức</h1>
            <p className="text-muted-foreground mt-2">
              Quản lý thông tin và cài đặt của tổ chức
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {organizerInfo.verified && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Đã xác thực
              </Badge>
            )}
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={isSaving || isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Thông tin tổ chức
                </CardTitle>
                <CardDescription>
                  Thông tin cơ bản về tổ chức của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên tổ chức *</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Nhập tên tổ chức"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">
                        {organizerInfo.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email liên hệ *</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@example.com"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {organizerInfo.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+84 123 456 789"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {organizerInfo.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://example.com"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        {organizerInfo.website}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ đầy đủ"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {organizerInfo.address}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả tổ chức</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Mô tả về tổ chức, sứ mệnh, tầm nhìn..."
                      rows={4}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">
                      {organizerInfo.description}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê tổ chức</CardTitle>
                <CardDescription>
                  Thông tin về hoạt động của tổ chức
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{organizerInfo.memberCount}</div>
                    <div className="text-sm text-muted-foreground">Thành viên</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Cuộc thi đã tổ chức</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">1,250+</div>
                    <div className="text-sm text-muted-foreground">Thí sinh tham gia</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Organization Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Logo tổ chức</CardTitle>
                <CardDescription>
                  Logo sẽ hiển thị trong các cuộc thi
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {organizerInfo.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={organizerInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                {isEditing && (
                  <>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
                    <Button variant="outline" size="sm" onClick={onPickLogo}>
                      Thay đổi logo
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>



            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái xác thực</CardTitle>
              </CardHeader>
              <CardContent>
                {organizerInfo.verified ? (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <div className="font-medium text-green-800">Đã xác thực</div>
                      <div className="text-sm text-green-600">Tổ chức đã được xác minh</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <div className="font-medium text-yellow-800">Chưa xác thực</div>
                      <div className="text-sm text-yellow-600">Vui lòng hoàn tất quy trình xác thực</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 