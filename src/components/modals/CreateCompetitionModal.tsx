import { useState, useEffect } from "react";
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
import { Competition, CompetitionConstants } from "@/types";
import { CompetitionCategory, CompetitionLevel, CompetitionStatus } from "@/interfaces/ICompetition";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { createCompetition } from "@/services/features/competitions/competitionsSlice";
import { fetchPlans } from "@/services/features/plans/plansSlice";
import { CreateCompetitionRequest } from "@/interfaces/ICompetition";
import { Plan } from "@/interfaces/IPlan";
import { COMPETITIONS_CONSTANTS_ENDPOINT } from "@/services/constant/apiConfig";

interface CreateCompetitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (competition: Partial<Competition>) => void;
}

// Options are fetched from API constants

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
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { plans, isLoading: plansLoading } = useAppSelector((state) => state.plans);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [constants, setConstants] = useState<CompetitionConstants | null>(null);
    const [isConstantsLoading, setIsConstantsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        // Store lowercase values expected by backend (e.g., "hackathon", "beginner", "draft")
        category: "" as unknown as string,
        status: "" as unknown as string,
        planId: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        location: "",
        prizePool: "",
        maxParticipants: "",
        isRegisteredAsTeam: false,
        maxParticipantsPerTeam: 4,
        level: "" as unknown as string,
        tags: [] as string[],
        imageUrl: "",
        website: "",
        rules: "",
        featured: false,
        requiredSkills: [] as string[],
    });

    const [newTag, setNewTag] = useState("");
    const [skillSearch, setSkillSearch] = useState("");

    // Fetch plans and constants when modal opens
    useEffect(() => {
        const doFetch = async () => {
            try {
                if (plans.length === 0) {
                    dispatch(fetchPlans());
                }
                setIsConstantsLoading(true);
                const res = await fetch(COMPETITIONS_CONSTANTS_ENDPOINT);
                const json = await res.json();
                if (json?.status === "success" && json?.data) {
                    setConstants(json.data as CompetitionConstants);
                } else {
                    setConstants(null);
                }
            } catch (e) {
                setConstants(null);
            } finally {
                setIsConstantsLoading(false);
            }
        };
        if (isOpen) doFetch();
    }, [isOpen, dispatch, plans.length]);

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
        const trimmedSkill = skill.trim();
        if (trimmedSkill && !formData.requiredSkills.includes(trimmedSkill)) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, trimmedSkill]
            }));
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    // No longer needed since we're using free-form input like tags
    // const filteredSkills = availableSkills.filter(skill =>
    //     skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
    //     !formData.requiredSkills.includes(skill)
    // );

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                return formData.title && formData.description && formData.category && formData.planId;
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

        if (!user) {
            toast({
                title: "Lỗi",
                description: "Bạn cần đăng nhập để tạo cuộc thi",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Map selected keys to Vietnamese labels from constants for payload
            const mapToLabel = (dict?: Record<string, string>, value?: string) => {
                if (!dict || !value) return value as any;
                const found = Object.entries(dict).find(([k]) => k.toLowerCase() === String(value).toLowerCase());
                return (found ? found[1] : value) as any;
            };

            const createRequest: CreateCompetitionRequest = {
                title: formData.title,
                description: formData.description,
                // send Vietnamese label strings
                category: mapToLabel(constants?.categories, formData.category),
                plan_id: formData.planId,
                start_date: new Date(formData.startDate).toISOString(),
                end_date: new Date(formData.endDate).toISOString(),
                registration_deadline: new Date(formData.registrationDeadline).toISOString(),
                location: formData.location,
                prize_pool_text: formData.prizePool || undefined,
                max_participants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
                isRegisteredAsTeam: formData.isRegisteredAsTeam,
                // Only include maxParticipantsPerTeam if isRegisteredAsTeam is true
                ...(formData.isRegisteredAsTeam && { maxParticipantsPerTeam: formData.maxParticipantsPerTeam }),
                level: mapToLabel(constants?.levels, formData.level),
                image_url: formData.imageUrl || undefined,
                website: formData.website || undefined,
                rules: formData.rules || undefined,
                featured: formData.featured,
                status: mapToLabel(constants?.statuses, formData.status),
                competitionTags: formData.tags,
                competitionRequiredSkills: formData.requiredSkills.map(skill => ({
                    name: skill,
                    category: "technical" as const
                })),
            };

            const result = await dispatch(createCompetition(createRequest)).unwrap();

            toast({
                title: "Thành công!",
                description: "Cuộc thi đã được tạo thành công",
            });

            onSuccess?.(result.data as any);
            onClose();

            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "" as unknown as string,
                status: "DRAFT" as unknown as string,
                planId: "",
                startDate: "",
                endDate: "",
                registrationDeadline: "",
                location: "",
                prizePool: "",
                maxParticipants: "",
                isRegisteredAsTeam: false,
                maxParticipantsPerTeam: 4,
                level: "" as unknown as string,
                tags: [],
                imageUrl: "",
                website: "",
                rules: "",
                featured: false,
                requiredSkills: [],
            });
            setCurrentStep(1);
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error || "Có lỗi xảy ra khi tạo cuộc thi",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
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

            <div className="space-y-2">
                <Label>Gói dịch vụ theo tháng *</Label>
                <Select
                    value={formData.planId}
                    onValueChange={(value) => handleInputChange("planId", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn gói dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                        {plansLoading ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">Đang tải...</div>
                        ) : plans.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">Không có gói dịch vụ</div>
                        ) : (
                            plans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                    {plan.name} - {plan.price_amount.toLocaleString('vi-VN')} {plan.currency}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                {formData.planId && (
                    <p className="text-sm text-muted-foreground">
                        {plans.find(p => p.id === formData.planId)?.description}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Danh mục *</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={isConstantsLoading ? "Đang tải..." : "Chọn danh mục"} />
                        </SelectTrigger>
                        <SelectContent>
                            {isConstantsLoading && (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">Đang tải...</div>
                            )}
                            {!isConstantsLoading && constants &&
                                Object.entries(constants.categories).map(([key, label]) => (
                                    <SelectItem key={key} value={key.toLowerCase()}>
                                        {label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Trạng thái *</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange("status", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={isConstantsLoading ? "Đang tải..." : "Chọn trạng thái"} />
                        </SelectTrigger>
                        <SelectContent>
                            {isConstantsLoading && (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">Đang tải...</div>
                            )}
                            {!isConstantsLoading && constants &&
                                Object.entries(constants.statuses).map(([key, label]) => (
                                    <SelectItem key={key} value={key.toLowerCase()}>
                                        {label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
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
                    id="isRegisteredAsTeam"
                    checked={formData.isRegisteredAsTeam}
                    onCheckedChange={(checked) => handleInputChange("isRegisteredAsTeam", checked)}
                />
                <Label htmlFor="isRegisteredAsTeam">Đăng ký theo nhóm</Label>
            </div>

            {formData.isRegisteredAsTeam && (
                <div className="space-y-2">
                    <Label htmlFor="maxParticipantsPerTeam">Số thành viên tối đa trong nhóm</Label>
                    <Input
                        id="maxParticipantsPerTeam"
                        type="number"
                        min="2"
                        max="10"
                        value={formData.maxParticipantsPerTeam}
                        onChange={(e) => handleInputChange("maxParticipantsPerTeam", parseInt(e.target.value))}
                    />
                </div>
            )}

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
                        <SelectValue placeholder={isConstantsLoading ? "Đang tải..." : "Chọn độ khó"} />
                    </SelectTrigger>
                    <SelectContent>
                        {isConstantsLoading && (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">Đang tải...</div>
                        )}
                        {!isConstantsLoading && constants &&
                            Object.entries(constants.levels).map(([key, label]) => (
                                <SelectItem key={key} value={key.toLowerCase()}>
                                    {label}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Kỹ năng yêu cầu *</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Nhập kỹ năng và nhấn Enter"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill(skillSearch);
                                setSkillSearch("");
                            }
                        }}
                    />
                    <Button type="button" onClick={() => {
                        if (skillSearch.trim()) {
                            addSkill(skillSearch);
                            setSkillSearch("");
                        }
                    }} size="sm">
                        <Plus className="h-4 w-4" />
                    </Button>
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

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
                <Label htmlFor="featured">Hiển thị nổi bật</Label>
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
                        Bước {currentStep} / 3: {
                            currentStep === 1 ? "Thông tin cơ bản" :
                                currentStep === 2 ? "Thời gian và địa điểm" :
                                    "Yêu cầu và kỹ năng"
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                </div>

                <ScrollArea className="max-h-[calc(85vh-200px)]">
                    <div className="space-y-6 p-1">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
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

                        {currentStep < 3 ? (
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