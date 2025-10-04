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
import { CompetitionDetail } from "@/interfaces/ICompetition";
import { CompetitionCategory, CompetitionLevel, CompetitionStatus } from "@/interfaces/ICompetition";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { updateCompetition } from "@/services/features/competitions/competitionsSlice";
import { UpdateCompetitionRequest } from "@/interfaces/ICompetition";

interface UpdateCompetitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    competition: CompetitionDetail | null;
    onSuccess?: (competition: CompetitionDetail) => void;
}

const categories: { value: CompetitionCategory; label: string }[] = [
    { value: "hackathon", label: "Hackathon" },
    { value: "datathon", label: "Datathon" },
    { value: "designathon", label: "Designathon" },
    { value: "business_case", label: "Business Case" },
    { value: "coding_contest", label: "Coding Contest" },
    { value: "other", label: "Khác" },
];

const levels: { value: CompetitionLevel; label: string }[] = [
    { value: "beginner", label: "Cơ bản" },
    { value: "intermediate", label: "Trung bình" },
    { value: "advanced", label: "Nâng cao" },
    { value: "all_levels", label: "Tất cả cấp độ" },
];

const statuses: { value: CompetitionStatus; label: string }[] = [
    { value: "draft", label: "Nháp" },
    { value: "published", label: "Đã xuất bản" },
    { value: "registration_open", label: "Mở đăng ký" },
    { value: "registration_closed", label: "Đóng đăng ký" },
    { value: "in_progress", label: "Đang diễn ra" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
];

const availableSkills = [
    "React", "Vue.js", "Angular", "Node.js", "Python", "Java", "C++", "C#",
    "JavaScript", "TypeScript", "PHP", "Go", "Rust", "Swift", "Kotlin",
    "UI/UX Design", "Graphic Design", "Web Design", "Mobile Design",
    "Business Planning", "Marketing", "Finance", "Project Management",
    "Data Science", "Machine Learning", "AI", "Blockchain", "DevOps",
    "Cloud Computing", "Cybersecurity", "Database", "Testing", "Leadership",
];

export default function UpdateCompetitionModal({
    isOpen,
    onClose,
    competition,
    onSuccess,
}: UpdateCompetitionModalProps) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "" as CompetitionCategory,
        status: "" as CompetitionStatus,
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        location: "",
        prizePool: "",
        maxParticipants: "",
        isRegisteredAsTeam: false,
        maxParticipantsPerTeam: 4,
        level: "" as CompetitionLevel,
        tags: [] as string[],
        imageUrl: "",
        website: "",
        rules: "",
        featured: false,
        requiredSkills: [] as string[],
    });

    const [newTag, setNewTag] = useState("");
    const [skillSearch, setSkillSearch] = useState("");

    // Initialize form data when competition changes
    useEffect(() => {
        if (competition && isOpen) {
            setFormData({
                title: competition.title || "",
                description: competition.description || "",
                category: competition.category || "other",
                status: competition.status || "draft",
                startDate: competition.startDate ? new Date(competition.startDate).toISOString().slice(0, 16) : "",
                endDate: competition.endDate ? new Date(competition.endDate).toISOString().slice(0, 16) : "",
                registrationDeadline: competition.registrationDeadline ? new Date(competition.registrationDeadline).toISOString().slice(0, 16) : "",
                location: competition.location || "",
                prizePool: competition.prizePool || "",
                maxParticipants: competition.maxParticipants?.toString() || "",
                isRegisteredAsTeam: competition.isRegisteredAsTeam || false,
                maxParticipantsPerTeam: competition.maxParticipantsPerTeam || 4,
                level: competition.level || "beginner",
                tags: competition.tags || [],
                imageUrl: competition.imageUrl || "",
                website: competition.website || "",
                rules: competition.rules || "",
                featured: competition.featured || false,
                requiredSkills: competition.requiredSkills?.map(skill => skill.name) || [],
            });
        }
    }, [competition, isOpen]);

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

    const handleSubmit = async () => {
        if (!competition?.id) {
            toast({
                title: "Lỗi",
                description: "Không tìm thấy cuộc thi để cập nhật",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Prepare API request
            const updateRequest: UpdateCompetitionRequest = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                status: formData.status,
                start_date: new Date(formData.startDate).toISOString(),
                end_date: new Date(formData.endDate).toISOString(),
                registration_deadline: new Date(formData.registrationDeadline).toISOString(),
                location: formData.location,
                prize_pool_text: formData.prizePool || undefined,
                max_participants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
                isRegisteredAsTeam: formData.isRegisteredAsTeam,
                // Only include maxParticipantsPerTeam if isRegisteredAsTeam is true
                ...(formData.isRegisteredAsTeam && { maxParticipantsPerTeam: formData.maxParticipantsPerTeam }),
                level: formData.level,
                image_url: formData.imageUrl || undefined,
                website: formData.website || undefined,
                rules: formData.rules || undefined,
                featured: formData.featured,
                competitionTags: formData.tags,
                competitionRequiredSkills: formData.requiredSkills.map(skill => ({
                    name: skill,
                    category: "technical" as const
                })),
            };

            const result = await dispatch(updateCompetition({
                id: competition.id,
                data: updateRequest
            })).unwrap();

            onSuccess?.(competition);
            onClose();
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error || "Có lỗi xảy ra khi cập nhật cuộc thi",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!competition) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Cập nhật cuộc thi
                    </DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin cuộc thi: {competition.title}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(85vh-200px)]">
                    <div className="space-y-6 p-1">
                        {/* Basic Information */}
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

                            <div className="grid grid-cols-3 gap-4">
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
                                    <Label>Trạng thái *</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleInputChange("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

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

                        <Separator />

                        {/* Time and Location */}
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

                        <Separator />

                        {/* Skills and Tags */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Yêu cầu và kỹ năng</h3>

                            <div className="space-y-2">
                                <Label>Kỹ năng yêu cầu</Label>
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
                    </div>
                </ScrollArea>

                <Separator />

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Đang cập nhật..." : "Cập nhật cuộc thi"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
