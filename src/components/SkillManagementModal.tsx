import { useState, useEffect } from "react";
import { Plus, X, Search, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import {
    fetchUserSkills,
    fetchAllSkills,
    addUserSkill,
    deleteUserSkill,
    UserSkill,
    AllSkill,
} from "@/services/features/users/userSlice";

interface SkillManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const skillLevels = [
    { value: "beginner", label: "Mới bắt đầu" },
    { value: "intermediate", label: "Trung cấp" },
    { value: "advanced", label: "Nâng cao" },
    { value: "expert", label: "Chuyên gia" },
];

const skillCategories = [
    { value: "technical", label: "Kỹ thuật" },
    { value: "language", label: "Ngôn ngữ" },
    { value: "design", label: "Thiết kế" },
    { value: "business", label: "Kinh doanh" },
    { value: "science", label: "Khoa học" },
    { value: "communication", label: "Giao tiếp" },
    { value: "leadership", label: "Lãnh đạo" },
];

export default function SkillManagementModal({
    isOpen,
    onClose,
}: SkillManagementModalProps) {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { userSkills, allSkills, isLoading } = useAppSelector((state) => state.user);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState({
        skill_name: "",
        category: "",
        level: "",
        experience_years: 1,
    });

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchUserSkills());
            dispatch(fetchAllSkills());
        }
    }, [isOpen, dispatch]);

    const handleAddSkill = async () => {
        if (!newSkill.skill_name || !newSkill.category || !newSkill.level) {
            toast({
                title: "Lỗi",
                description: "Vui lòng điền đầy đủ thông tin",
                variant: "destructive",
            });
            return;
        }

        try {
            await dispatch(addUserSkill(newSkill)).unwrap();
            toast({
                title: "Thành công",
                description: "Đã thêm kỹ năng thành công",
            });
            setNewSkill({
                skill_name: "",
                category: "",
                level: "",
                experience_years: 1,
            });
            setIsAddingSkill(false);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Thêm kỹ năng thất bại",
                variant: "destructive",
            });
        }
    };

    const handleDeleteSkill = async (skillId: string) => {
        try {
            await dispatch(deleteUserSkill(skillId)).unwrap();
            toast({
                title: "Thành công",
                description: "Đã xóa kỹ năng thành công",
            });
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Xóa kỹ năng thất bại",
                variant: "destructive",
            });
        }
    };

    const filteredAllSkills = allSkills.filter((skill) => {
        const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || !selectedCategory || skill.category === selectedCategory;
        const notAlreadyAdded = !userSkills.some(userSkill => userSkill.skill_name === skill.name);
        return matchesSearch && matchesCategory && notAlreadyAdded;
    });

    const getSkillLevelLabel = (level: string) => {
        const levelObj = skillLevels.find(l => l.value === level);
        return levelObj?.label || level;
    };

    const getSkillCategoryLabel = (category: string) => {
        const categoryObj = skillCategories.find(c => c.value === category);
        return categoryObj?.label || category;
    };

    const getSkillLevelColor = (level: string) => {
        const colors = {
            beginner: "bg-green-100 text-green-700 border-green-200",
            intermediate: "bg-blue-100 text-blue-700 border-blue-200",
            advanced: "bg-orange-100 text-orange-700 border-orange-200",
            expert: "bg-red-100 text-red-700 border-red-200",
        };
        return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Thêm kỹ năng
                    </DialogTitle>
                    <DialogDescription>
                        Thêm kỹ năng mới và duyệt các kỹ năng có sẵn
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">

                    {/* Add New Skill */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Thêm kỹ năng mới</h3>
                            <Button
                                onClick={() => setIsAddingSkill(!isAddingSkill)}
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {isAddingSkill ? "Hủy" : "Thêm kỹ năng"}
                            </Button>
                        </div>

                        {isAddingSkill && (
                            <div className="p-4 border rounded-lg space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="skill_name">Tên kỹ năng *</Label>
                                        <Input
                                            id="skill_name"
                                            placeholder="VD: JavaScript, Python, React..."
                                            value={newSkill.skill_name}
                                            onChange={(e) =>
                                                setNewSkill({ ...newSkill, skill_name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Danh mục *</Label>
                                        <Select
                                            value={newSkill.category}
                                            onValueChange={(value) =>
                                                setNewSkill({ ...newSkill, category: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn danh mục" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {skillCategories.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="level">Mức độ *</Label>
                                        <Select
                                            value={newSkill.level}
                                            onValueChange={(value) =>
                                                setNewSkill({ ...newSkill, level: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn mức độ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {skillLevels.map((level) => (
                                                    <SelectItem key={level.value} value={level.value}>
                                                        {level.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience_years">Số năm kinh nghiệm</Label>
                                        <Input
                                            id="experience_years"
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={newSkill.experience_years}
                                            onChange={(e) =>
                                                setNewSkill({
                                                    ...newSkill,
                                                    experience_years: parseInt(e.target.value) || 1,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsAddingSkill(false)}>
                                        Hủy
                                    </Button>
                                    <Button onClick={handleAddSkill} disabled={isLoading}>
                                        {isLoading ? "Đang thêm..." : "Thêm kỹ năng"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Browse Available Skills */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kỹ năng có sẵn</h3>

                        {/* Search and Filter */}
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm kỹ năng..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Tất cả danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                                    {skillCategories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Available Skills List */}
                        <ScrollArea className="h-64 border rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {filteredAllSkills.map((skill) => (
                                    <div
                                        key={skill._id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div>
                                            <div className="font-medium">{skill.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {getSkillCategoryLabel(skill.category)}
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setNewSkill({
                                                    skill_name: skill.name,
                                                    category: skill.category,
                                                    level: "",
                                                    experience_years: 1,
                                                });
                                                setIsAddingSkill(true);
                                            }}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Thêm
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {filteredAllSkills.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không tìm thấy kỹ năng nào
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={onClose}>
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
