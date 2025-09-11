import { useState } from "react";
import { Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Competition, CompetitionCategory, CompetitionLevel } from "@/types";

interface CreateCompetitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (competition: Partial<Competition>) => void;
}

const categories: { value: CompetitionCategory; label: string }[] = [
    { value: "programming", label: "Lập trình" },
    { value: "design", label: "Thiết kế" },
    { value: "business", label: "Kinh doanh" },
    { value: "science", label: "Khoa học" },
    { value: "mathematics", label: "Toán học" },
    { value: "innovation", label: "Sáng tạo" },
    { value: "startup", label: "Khởi nghiệp" },
    { value: "creative", label: "Sáng tạo" },
];

const levels: { value: CompetitionLevel; label: string }[] = [
    { value: "beginner", label: "Cơ bản" },
    { value: "intermediate", label: "Trung bình" },
    { value: "advanced", label: "Nâng cao" },
    { value: "expert", label: "Chuyên gia" },
];

const availableSkills = [
    "React", "Vue.js", "Angular", "Node.js", "Python", "Java", "C++", "C#",
    "JavaScript", "TypeScript", "PHP", "Go", "Rust", "Swift", "Kotlin",
    "UI/UX Design", "Graphic Design", "Web Design", "Mobile Design",
    "Business Planning", "Marketing", "Finance", "Project Management",
    "Data Science", "Machine Learning", "AI", "Blockchain", "DevOps",
    "Cloud Computing", "Cybersecurity", "Database", "Testing", "Leadership",
];

export default function CreateCompetitionModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateCompetitionModalProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "" as CompetitionCategory,
        organizer: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        location: "",
        isOnline: false,
        prizePool: "",
        maxParticipants: "",
        level: "" as CompetitionLevel,
        tags: [] as string[],
        imageUrl: "",
        website: "",
        rules: "",
        featured: false,
        requiredSkills: [] as string[],
        // Settings
        allowLateRegistration: false,
        autoApproveRegistrations: true,
        registrationFee: "",
        emailNotifications: true,
        publicLeaderboard: true,
        allowTeamRegistration: true,
        maxTeamSize: 5,
    });

    const [newTag, setNewTag] = useState("");
    const [skillSearch, setSkillSearch] = useState("");

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const addSkill = (skill: string) => {
        if (!formData.requiredSkills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skill]
            }));
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !formData.requiredSkills.includes(skill)
    );

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                return formData.title && formData.description && formData.category && formData.organizer;
            case 2:
                return formData.startDate && formData.endDate && formData.registrationDeadline && formData.location;
            case 3:
                return formData.level && formData.requiredSkills.length > 0;
            default:
                return true;
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            toast({
                title: "Lỗi",
                description: "Vui lòng điền đầy đủ thông tin bắt buộc",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newCompetition: Partial<Competition> = {
                id: Date.now().toString(),
                title: formData.title,
                description: formData.description,
                category: formData.category,
                organizer: formData.organizer,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                registrationDeadline: new Date(formData.registrationDeadline),
                location: formData.location,
                isOnline: formData.isOnline,
                prizePool: formData.prizePool || undefined,
                participants: 0,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
                requiredSkills: formData.requiredSkills.map(skill => ({ name: skill, category: "technical" })),
                level: formData.level,
                tags: formData.tags,
                imageUrl: formData.imageUrl || undefined,
                website: formData.website || undefined,
                rules: formData.rules || undefined,
                featured: formData.featured,
                status: "upcoming" as const,
            };

            toast({
                title: "Thành công!",
                description: "Cuộc thi đã được tạo thành công",
            });

            onSuccess?.(newCompetition);
            onClose();

            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "" as CompetitionCategory,
                organizer: "",
                startDate: "",
                endDate: "",
                registrationDeadline: "",
                location: "",
                isOnline: false,
                prizePool: "",
                maxParticipants: "",
                level: "" as CompetitionLevel,
                tags: [],
                imageUrl: "",
                website: "",
                rules: "",
                featured: false,
                requiredSkills: [],
                allowLateRegistration: false,
                autoApproveRegistrations: true,
                registrationFee: "",
                emailNotifications: true,
                publicLeaderboard: true,
                allowTeamRegistration: true,
                maxTeamSize: 5,
            });
            setCurrentStep(1);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi tạo cuộc thi",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        } else {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng điền đầy đủ thông tin bắt buộc trước khi tiếp tục",
                variant: "destructive",
            });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>

            <div className="space-y-2">
                <Label htmlFor="title">Tên cuộc thi *</Label>
                <Input
                    id="title"
                    placeholder="VD: Vietnam Programming Contest 2024"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về cuộc thi, mục tiêu, và những gì thí sinh sẽ nhận được..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Danh mục *</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="organizer">Ban tổ chức *</Label>
                    <Input
                        id="organizer"
                        placeholder="VD: Đại học Bách Khoa"
                        value={formData.organizer}
                        onChange={(e) => handleInputChange("organizer", e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrl">URL hình ảnh</Label>
                <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                    id="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thời gian và địa điểm</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">Hạn đăng ký *</Label>
                    <Input
                        id="registrationDeadline"
                        type="datetime-local"
                        value={formData.registrationDeadline}
                        onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                        id="startDate"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                        id="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Địa điểm *</Label>
                <Input
                    id="location"
                    placeholder="VD: Hà Nội, TP.HCM, hoặc Online"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isOnline"
                    checked={formData.isOnline}
                    onCheckedChange={(checked) => handleInputChange("isOnline", checked)}
                />
                <Label htmlFor="isOnline">Cuộc thi online</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Số thí sinh tối đa</Label>
                    <Input
                        id="maxParticipants"
                        type="number"
                        placeholder="VD: 500"
                        value={formData.maxParticipants}
                        onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="prizePool">Giải thưởng</Label>
                    <Input
                        id="prizePool"
                        placeholder="VD: 100.000.000 VNĐ"
                        value={formData.prizePool}
                        onChange={(e) => handleInputChange("prizePool", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Yêu cầu và kỹ năng</h3>

            <div className="space-y-2">
                <Label>Độ khó *</Label>
                <Select
                    value={formData.level}
                    onValueChange={(value) => handleInputChange("level", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                        {levels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                                {level.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Kỹ năng yêu cầu *</Label>
                <div className="space-y-2">
                    <Input
                        placeholder="Tìm kiếm kỹ năng..."
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                    />
                    <ScrollArea className="h-32 border rounded-md p-2">
                        <div className="grid grid-cols-2 gap-1">
                            {filteredSkills.map((skill) => (
                                <Button
                                    key={skill}
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start text-xs h-8"
                                    onClick={() => addSkill(skill)}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    {skill}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {formData.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                                <X
                                    className="h-3 w-3 ml-1 cursor-pointer"
                                    onClick={() => removeSkill(skill)}
                                />
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Nhập tag và nhấn Enter"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                                <X
                                    className="h-3 w-3 ml-1 cursor-pointer"
                                    onClick={() => removeTag(tag)}
                                />
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="rules">Quy định cuộc thi</Label>
                <Textarea
                    id="rules"
                    placeholder="Mô tả chi tiết về quy định, điều kiện tham gia, cách thức đánh giá..."
                    rows={4}
                    value={formData.rules}
                    onChange={(e) => handleInputChange("rules", e.target.value)}
                />
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cài đặt cuộc thi</h3>

            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange("featured", checked)}
                    />
                    <Label htmlFor="featured">Hiển thị nổi bật</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="allowLateRegistration"
                        checked={formData.allowLateRegistration}
                        onCheckedChange={(checked) => handleInputChange("allowLateRegistration", checked)}
                    />
                    <Label htmlFor="allowLateRegistration">Cho phép đăng ký muộn</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="autoApproveRegistrations"
                        checked={formData.autoApproveRegistrations}
                        onCheckedChange={(checked) => handleInputChange("autoApproveRegistrations", checked)}
                    />
                    <Label htmlFor="autoApproveRegistrations">Tự động duyệt đăng ký</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="allowTeamRegistration"
                        checked={formData.allowTeamRegistration}
                        onCheckedChange={(checked) => handleInputChange("allowTeamRegistration", checked)}
                    />
                    <Label htmlFor="allowTeamRegistration">Cho phép đăng ký theo nhóm</Label>
                </div>

                {formData.allowTeamRegistration && (
                    <div className="space-y-2 ml-6">
                        <Label htmlFor="maxTeamSize">Số thành viên tối đa trong nhóm</Label>
                        <Input
                            id="maxTeamSize"
                            type="number"
                            min="2"
                            max="10"
                            value={formData.maxTeamSize}
                            onChange={(e) => handleInputChange("maxTeamSize", parseInt(e.target.value))}
                        />
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="publicLeaderboard"
                        checked={formData.publicLeaderboard}
                        onCheckedChange={(checked) => handleInputChange("publicLeaderboard", checked)}
                    />
                    <Label htmlFor="publicLeaderboard">Bảng xếp hạng công khai</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="emailNotifications"
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                    />
                    <Label htmlFor="emailNotifications">Gửi thông báo email</Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="registrationFee">Phí đăng ký (VNĐ)</Label>
                    <Input
                        id="registrationFee"
                        type="number"
                        placeholder="0"
                        value={formData.registrationFee}
                        onChange={(e) => handleInputChange("registrationFee", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Tạo cuộc thi mới
                    </DialogTitle>
                    <DialogDescription>
                        Bước {currentStep} / 4: {
                            currentStep === 1 ? "Thông tin cơ bản" :
                                currentStep === 2 ? "Thời gian và địa điểm" :
                                    currentStep === 3 ? "Yêu cầu và kỹ năng" :
                                        "Cài đặt cuộc thi"
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                </div>

                <ScrollArea className="max-h-[calc(85vh-200px)]">
                    <div className="space-y-6 p-1">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                    </div>
                </ScrollArea>

                <Separator />

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                    >
                        Quay lại
                    </Button>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Hủy
                        </Button>

                        {currentStep < 4 ? (
                            <Button onClick={nextStep}>
                                Tiếp tục
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? "Đang tạo..." : "Tạo cuộc thi"}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 