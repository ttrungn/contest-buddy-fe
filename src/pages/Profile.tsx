import { useEffect, useMemo, useState } from "react";
import {
  User,
  MapPin,
  School,
  Calendar,
  Trophy,
  Star,
  Github,
  Linkedin,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ProjectModal from "@/components/ProjectModal";
// Define skill categories for display
const skillCategories = [
  { value: "technical", label: "Kỹ thuật" },
  { value: "language", label: "Ngôn ngữ" },
  { value: "design", label: "Thiết kế" },
  { value: "business", label: "Kinh doanh" },
  { value: "science", label: "Khoa học" },
  { value: "communication", label: "Giao tiếp" },
  { value: "leadership", label: "Lãnh đạo" },
];
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchCustomerProfile, uploadCustomerAvatar, updateCustomerProfile, fetchUserSkills, deleteUserSkill, updateUserSkill, fetchUserProjects, addUserProject, updateUserProject, deleteUserProject, fetchUserAchievements, addUserAchievement, updateUserAchievement, deleteUserAchievement, fetchAchievementDetail } from "@/services/features/users/userSlice";
import { useToast } from "@/hooks/use-toast";
import SkillManagementModal from "@/components/SkillManagementModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { profile, userSkills, isLoading, projects, achievements } = useAppSelector((s) => s.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [isEditSkillModalOpen, setIsEditSkillModalOpen] = useState(false);
  const [editSkillData, setEditSkillData] = useState({
    level: "",
    experience_years: 0,
  });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    project_url: "",
    github_url: "",
    image: null as File | null,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editData, setEditData] = useState({
    full_name: "",
    email: "",
    bio: "",
    school: "",
    city: "",
    region: "",
    country: "",
    study_field: "",
    social_links: { github: "", linkedin: "", personal: "" },
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = (typeof window !== "undefined") ? (document.createElement("input") as HTMLInputElement) : null;

  // Achievement modal state
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [achievementForm, setAchievementForm] = useState({
    competition_name: "",
    position: 1,
    award: "",
    achieved_at: "",
    category: "",
    description: "",
  });

  // Achievement detail modal state
  const [isAchievementDetailOpen, setIsAchievementDetailOpen] = useState(false);
  const [achievementDetail, setAchievementDetail] = useState<null | {
    _id: string;
    id: string;
    user_id: string;
    competition_name: string;
    position: number;
    award: string;
    achieved_at: string;
    category: string;
    description?: string;
  }>(null);
  const [loadingAchievementDetail, setLoadingAchievementDetail] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomerProfile());
    dispatch(fetchUserSkills());
    dispatch(fetchUserProjects());
    dispatch(fetchUserAchievements());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setEditData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        school: profile.school || "",
        city: profile.city || "",
        region: profile.region || "",
        country: profile.country || "",
        study_field: profile.study_field || "",
        social_links: {
          github: profile.social_links?.github || "",
          linkedin: profile.social_links?.linkedin || "",
          personal: profile.social_links?.personal || "",
        },
      });
    }
  }, [profile]);

  const activeUser = useMemo(() => {
    if (!profile) return null;
    return {
      fullName: profile.full_name,
      username: profile.username,
      avatar: profile.avatarUrl || profile.avatar_url || "",
      rating: profile.rating || 0,
      isVerified: true,
      bio: profile.bio || "",
      school: profile.school || "",
      location: { city: profile.city || "", region: profile.region || "" },
      studyField: profile.study_field || "",
      joinDate: new Date(profile.join_date),
      socialLinks: {
        github: profile.social_links?.github || "",
        linkedin: profile.social_links?.linkedin || "",
        behance: "",
      },
      achievements: achievements.map(a => ({
        id: a.id,
        competitionTitle: a.competition_name,
        position: a.position,
        award: a.award,
        date: new Date(a.achieved_at),
        category: a.category,
        teamSize: undefined,
      })),
      portfolio: [],
      skills: userSkills.map(skill => ({
        name: skill.skill_name,
        category: skill.category as any,
        level: skill.level as any,
        experienceYears: skill.experience_years,
        certifications: [],
      })),
    };
  }, [profile, userSkills, achievements]);

  const handleAvatarClick = () => {
    if (!fileInputRef) return;
    fileInputRef.type = "file";
    fileInputRef.accept = "image/*";
    fileInputRef.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const res = await dispatch(uploadCustomerAvatar(file)).unwrap();
        if (res.success) {
          toast({ title: "Cập nhật ảnh đại diện thành công" });
          dispatch(fetchCustomerProfile());
        } else {
          toast({ title: "Tải ảnh thất bại", variant: "destructive" });
        }
      } catch (err: any) {
        toast({ title: "Tải ảnh thất bại", description: String(err), variant: "destructive" });
      } finally {
        setUploading(false);
        fileInputRef.value = "";
      }
    };
    fileInputRef.click();
  };

  const handleSave = async () => {
    try {
      await dispatch(updateCustomerProfile(editData)).unwrap();
      toast({ title: "Cập nhật hồ sơ thành công" });
      setIsEditing(false);
      dispatch(fetchCustomerProfile());
    } catch (err: any) {
      toast({ title: "Cập nhật thất bại", description: String(err), variant: "destructive" });
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await dispatch(deleteUserSkill(skillId)).unwrap();
      toast({ title: "Thành công", description: "Đã xóa kỹ năng thành công" });
    } catch (error) {
      toast({ title: "Lỗi", description: "Xóa kỹ năng thất bại", variant: "destructive" });
    }
  };

  const handleEditSkill = (skillId: string) => {
    const skill = userSkills.find(s => s._id === skillId);
    if (skill) {
      setEditSkillData({
        level: skill.level,
        experience_years: skill.experience_years,
      });
      setEditingSkill(skillId);
      setIsEditSkillModalOpen(true);
    }
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill) return;

    try {
      await dispatch(updateUserSkill({
        skillId: editingSkill,
        data: editSkillData
      })).unwrap();
      toast({ title: "Thành công", description: "Đã cập nhật kỹ năng thành công" });
      setIsEditSkillModalOpen(false);
      setEditingSkill(null);
    } catch (error) {
      toast({ title: "Lỗi", description: "Cập nhật kỹ năng thất bại", variant: "destructive" });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await dispatch(deleteUserProject(projectId)).unwrap();
      toast({ title: "Thành công", description: "Đã xóa dự án" });
    } catch (error) {
      toast({ title: "Lỗi", description: "Xóa dự án thất bại", variant: "destructive" });
    }
  };

  const handleSubmitProject = async () => {
    try {
      const formData = new FormData();
      formData.append("title", projectForm.title);
      formData.append("description", projectForm.description);
      formData.append("category", projectForm.category);
      if (selectedTags.length > 0) formData.append("tags", JSON.stringify(selectedTags));
      if (projectForm.project_url) formData.append("project_url", projectForm.project_url);
      if (projectForm.github_url) formData.append("github_url", projectForm.github_url);
      if (projectForm.image) formData.append("image", projectForm.image);

      if (editingProjectId) {
        await dispatch(updateUserProject({ projectId: editingProjectId, data: formData })).unwrap();
        toast({ title: "Thành công", description: "Đã cập nhật dự án" });
      } else {
        await dispatch(addUserProject(formData)).unwrap();
        toast({ title: "Thành công", description: "Đã thêm dự án" });
      }
      setIsProjectModalOpen(false);
      setEditingProjectId(null);
      setSelectedTags([]);
    } catch (error) {
      toast({ title: "Lỗi", description: "Lưu dự án thất bại", variant: "destructive" });
    }
  };

  const getSkillLevelLabel = (level: string) => {
    const labels = {
      beginner: "Mới bắt đầu",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
      expert: "Chuyên gia",
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getSkillLevelProgress = (level: string) => {
    const progress = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100,
    };
    return progress[level as keyof typeof progress] || 0;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  if (!activeUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">{isLoading ? "Đang tải hồ sơ..." : "Không thể tải hồ sơ"}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center md:text-left">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage
                    src={activeUser.avatar}
                    alt={activeUser.fullName}
                  />
                  <AvatarFallback className="text-lg">
                    {activeUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" onClick={handleAvatarClick} disabled={uploading}>
                  {uploading ? "Đang tải..." : "Đổi ảnh đại diện"}
                </Button>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(activeUser.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activeUser.rating.toFixed(1)}
                  </span>
                </div>
                {activeUser.isVerified && (
                  <Badge className="mt-2 bg-blue-100 text-blue-700">
                    ✓ Đã xác thực
                  </Badge>
                )}
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">
                      {activeUser.fullName}
                    </h1>
                    <p className="text-muted-foreground">
                      @{activeUser.username}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} size="sm">Lưu</Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">Hủy</Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <Label>Họ và tên</Label>
                      <Input value={editData.full_name} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label>Giới thiệu</Label>
                      <Textarea rows={3} value={editData.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Trường</Label>
                      <Input value={editData.school} onChange={(e) => setEditData({ ...editData, school: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Thành phố</Label>
                      <Input value={editData.city} onChange={(e) => setEditData({ ...editData, city: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Khu vực</Label>
                      <Input value={editData.region} onChange={(e) => setEditData({ ...editData, region: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Quốc gia</Label>
                      <Input value={editData.country} onChange={(e) => setEditData({ ...editData, country: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Ngành học</Label>
                      <Input value={editData.study_field} onChange={(e) => setEditData({ ...editData, study_field: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>GitHub</Label>
                      <Input value={editData.social_links.github} onChange={(e) => setEditData({ ...editData, social_links: { ...editData.social_links, github: e.target.value } })} />
                    </div>
                    <div className="space-y-1">
                      <Label>LinkedIn</Label>
                      <Input value={editData.social_links.linkedin} onChange={(e) => setEditData({ ...editData, social_links: { ...editData.social_links, linkedin: e.target.value } })} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label>Website cá nhân</Label>
                      <Input value={editData.social_links.personal} onChange={(e) => setEditData({ ...editData, social_links: { ...editData.social_links, personal: e.target.value } })} />
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-4">{activeUser.bio}</p>
                )}

                {/* Location and School */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <School className="h-4 w-4 mr-2" />
                    {activeUser.school}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {activeUser.location.city}, {activeUser.location.region}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    Ngành: {activeUser.studyField}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Tham gia: {formatDate(activeUser.joinDate)}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2">
                  {activeUser.socialLinks.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={activeUser.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {activeUser.socialLinks.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={activeUser.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {activeUser.socialLinks.behance && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={activeUser.socialLinks.behance}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Behance
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="achievements">Thành tích</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thống kê nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Cuộc thi tham gia
                    </span>
                    <span className="font-semibold">
                      {activeUser.achievements.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Huy chương
                    </span>
                    <span className="font-semibold">
                      {
                        activeUser.achievements.filter((a) => a.position <= 3)
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Dự án portfolio
                    </span>
                    <span className="font-semibold">
                      {projects.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Kỹ năng chuyên môn
                    </span>
                    <span className="font-semibold">
                      {userSkills.length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Thành tích gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeUser.achievements.slice(0, 3).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                              achievement.position === 1
                                ? "bg-yellow-500"
                                : achievement.position === 2
                                  ? "bg-gray-400"
                                  : achievement.position === 3
                                    ? "bg-orange-500"
                                    : "bg-blue-500",
                            )}
                          >
                            {achievement.position <= 3 ? (
                              <Trophy className="h-5 w-5" />
                            ) : (
                              achievement.position
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {achievement.competitionTitle}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.award} • {formatDate(achievement.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kỹ năng nổi bật</CardTitle>
              </CardHeader>
              <CardContent>
                {userSkills.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có kỹ năng nào. Hãy thêm kỹ năng đầu tiên!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userSkills.slice(0, 4).map((skill) => (
                      <div key={skill._id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{skill.skill_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {getSkillLevelLabel(skill.level)}
                          </span>
                        </div>
                        <Progress
                          value={getSkillLevelProgress(skill.level)}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {skill.experience_years} năm kinh nghiệm
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thành tích thi đấu</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {activeUser.achievements.length} cuộc thi
                    </Badge>
                    <Button size="sm" onClick={() => {
                      setEditingAchievementId(null);
                      setAchievementForm({ competition_name: "", position: 1, award: "", achieved_at: "", category: "", description: "" });
                      setIsAchievementModalOpen(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" /> Thêm thành tích
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeUser.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer"
                      onClick={async (e) => {
                        // Ignore clicks on action buttons
                        const target = e.target as HTMLElement;
                        if (target.closest('button')) return;
                        try {
                          setLoadingAchievementDetail(true);
                          const detail = await dispatch(fetchAchievementDetail(achievement.id)).unwrap();
                          setAchievementDetail(detail as any);
                          setIsAchievementDetailOpen(true);
                        } catch (err: any) {
                          toast({ title: "Không tải được chi tiết", description: String(err), variant: "destructive" });
                        } finally {
                          setLoadingAchievementDetail(false);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                          achievement.position === 1
                            ? "bg-yellow-500"
                            : achievement.position === 2
                              ? "bg-gray-400"
                              : achievement.position === 3
                                ? "bg-orange-500"
                                : "bg-blue-500",
                        )}
                      >
                        {achievement.position <= 3 ? (
                          <Trophy className="h-6 w-6" />
                        ) : (
                          achievement.position
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {achievement.competitionTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.award} • Hạng {achievement.position}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatDate(achievement.date)}</span>
                          <span>Lĩnh vực: {achievement.category}</span>
                          {achievement.teamSize && (
                            <span>Đội {achievement.teamSize} người</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const a = achievements.find(x => x.id === achievement.id);
                            if (!a) return;
                            setEditingAchievementId(a.id);
                            setAchievementForm({
                              competition_name: a.competition_name,
                              position: a.position,
                              award: a.award,
                              achieved_at: a.achieved_at.split('T')[0],
                              category: a.category,
                              description: a.description || "",
                            });
                            setIsAchievementModalOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await dispatch(deleteUserAchievement(achievement.id)).unwrap();
                              toast({ title: "Đã xóa thành tích" });
                            } catch (e: any) {
                              toast({ title: "Xóa thất bại", description: String(e), variant: "destructive" });
                            }
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dự án Portfolio</CardTitle>
                  <Button size="sm" onClick={() => {
                    setEditingProjectId(null);
                    setProjectForm({ title: "", description: "", category: "", tags: "", project_url: "", github_url: "", image: null });
                    setSelectedTags([]);
                    setIsProjectModalOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm dự án
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((item) => (
                    <Card key={item.id} className="card-hover">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {(item.title || '').split('"').join('').trim()}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingProjectId(item.id);
                                setProjectForm({
                                  title: (item.title || '').split('"').join('').trim(),
                                  description: (item.description || '').split('"').join('').trim(),
                                  category: (item.category || '').split('"').join('').trim(),
                                  tags: "",
                                  project_url: (item.project_url || '').split('"').join('').trim(),
                                  github_url: (item.github_url || '').split('"').join('').trim(),
                                  image: null,
                                });
                                try {
                                  const parsed = Array.isArray(item.tags) ? JSON.parse(item.tags[0]?.toString() || "[]") : [];
                                  if (Array.isArray(parsed)) setSelectedTags(parsed);
                                } catch { setSelectedTags([]); }
                                setIsProjectModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(item.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={(item.title || '').split('"').join('').trim()}
                            className="w-full h-40 object-cover rounded-md mb-3"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <p className="text-sm text-muted-foreground mb-4">
                          {(item.description || '').split('"').join('').trim()}
                        </p>
                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {(() => {
                              try {
                                const parsed = JSON.parse(item.tags[0].toString());
                                return (parsed as string[]).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ));
                              } catch {
                                return null;
                              }
                            })()}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 ml-auto">
                            {item.github_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={(item.github_url || '').split('"').join('').trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Github className="h-3 w-3 mr-1" />
                                  Code
                                </a>
                              </Button>
                            )}
                            {item.project_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={(item.project_url || '').split('"').join('').trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Demo
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Kỹ năng chuyên môn</CardTitle>
                  <Button size="sm" onClick={() => setIsSkillModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm kỹ năng
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {userSkills.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Chưa có kỹ năng nào</h3>
                    <p className="text-gray-500 mb-6">Hãy thêm kỹ năng đầu tiên để bắt đầu xây dựng hồ sơ của bạn!</p>
                    <Button
                      onClick={() => setIsSkillModalOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm kỹ năng đầu tiên
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {skillCategories.map((category) => {
                      const categorySkills = userSkills.filter(
                        (skill) => skill.category === category.value,
                      );

                      if (categorySkills.length === 0) return null;

                      return (
                        <div key={category.value}>
                          <h3 className="font-semibold mb-3 text-lg">
                            {category.label}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categorySkills.map((skill) => (
                              <div
                                key={skill._id}
                                className="group p-4 rounded-lg border hover:shadow-md transition-all duration-200"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">
                                    {skill.skill_name}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className={
                                        skill.level === "beginner" ? "bg-green-100 text-green-700 border-green-200" :
                                          skill.level === "intermediate" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                            skill.level === "advanced" ? "bg-orange-100 text-orange-700 border-orange-200" :
                                              skill.level === "expert" ? "bg-red-100 text-red-700 border-red-200" :
                                                "bg-gray-100 text-gray-700 border-gray-200"
                                      }
                                    >
                                      {getSkillLevelLabel(skill.level)}
                                    </Badge>
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditSkill(skill._id)}
                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteSkill(skill._id)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <Progress
                                  value={getSkillLevelProgress(skill.level)}
                                  className="mb-2"
                                />
                                <div className="text-xs text-muted-foreground">
                                  {skill.experience_years} năm kinh nghiệm
                                </div>
                              </div>
                            ))}
                          </div>
                          {category.value !==
                            skillCategories[skillCategories.length - 1].value && (
                              <Separator className="mt-6" />
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Skill Management Modal */}
      <SkillManagementModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
      />

      {/* Edit Skill Modal */}
      <Dialog open={isEditSkillModalOpen} onOpenChange={setIsEditSkillModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật kỹ năng</DialogTitle>
            <DialogDescription>
              Chỉnh sửa mức độ và kinh nghiệm của kỹ năng
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="level">Mức độ</Label>
              <Select
                value={editSkillData.level}
                onValueChange={(value) => setEditSkillData(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Mới bắt đầu</SelectItem>
                  <SelectItem value="intermediate">Trung cấp</SelectItem>
                  <SelectItem value="advanced">Nâng cao</SelectItem>
                  <SelectItem value="expert">Chuyên gia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_years">Số năm kinh nghiệm</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                max="50"
                value={editSkillData.experience_years}
                onChange={(e) => setEditSkillData(prev => ({
                  ...prev,
                  experience_years: parseInt(e.target.value) || 0
                }))}
                placeholder="Nhập số năm kinh nghiệm"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditSkillModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleUpdateSkill}
                disabled={!editSkillData.level || editSkillData.experience_years < 0}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Achievement Modal */}
      <Dialog open={isAchievementModalOpen} onOpenChange={setIsAchievementModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAchievementId ? "Cập nhật thành tích" : "Thêm thành tích"}</DialogTitle>
            <DialogDescription>
              {editingAchievementId ? "Chỉnh sửa thông tin thành tích" : "Tạo thành tích mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Tên cuộc thi</Label>
              <Input value={achievementForm.competition_name} onChange={(e) => setAchievementForm({ ...achievementForm, competition_name: e.target.value })} placeholder="Hackathon 2023" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Hạng</Label>
                <Input type="number" min={1} value={achievementForm.position} onChange={(e) => setAchievementForm({ ...achievementForm, position: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="space-y-1">
                <Label>Giải thưởng</Label>
                <Input value={achievementForm.award} onChange={(e) => setAchievementForm({ ...achievementForm, award: e.target.value })} placeholder="First Prize" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Ngày đạt được</Label>
                <Input type="date" value={achievementForm.achieved_at} onChange={(e) => setAchievementForm({ ...achievementForm, achieved_at: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Lĩnh vực</Label>
                <Input value={achievementForm.category} onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })} placeholder="Programming" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Mô tả</Label>
              <Textarea rows={3} value={achievementForm.description} onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })} placeholder="Mô tả ngắn về thành tích" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAchievementModalOpen(false)}>Hủy</Button>
              <Button onClick={async () => {
                try {
                  if (editingAchievementId) {
                    await dispatch(updateUserAchievement({
                      id: editingAchievementId, data: {
                        competition_name: achievementForm.competition_name,
                        position: achievementForm.position,
                        award: achievementForm.award,
                        achieved_at: achievementForm.achieved_at,
                        category: achievementForm.category,
                        description: achievementForm.description || undefined,
                      }
                    })).unwrap();
                    toast({ title: "Đã cập nhật thành tích" });
                  } else {
                    await dispatch(addUserAchievement({
                      competition_name: achievementForm.competition_name,
                      position: achievementForm.position,
                      award: achievementForm.award,
                      achieved_at: achievementForm.achieved_at,
                      category: achievementForm.category,
                      description: achievementForm.description || undefined,
                    })).unwrap();
                    toast({ title: "Đã thêm thành tích" });
                  }
                  setIsAchievementModalOpen(false);
                  setEditingAchievementId(null);
                } catch (e: any) {
                  toast({ title: "Lưu thất bại", description: String(e), variant: "destructive" });
                }
              }} disabled={!achievementForm.competition_name || !achievementForm.award || !achievementForm.achieved_at || !achievementForm.category}>
                {editingAchievementId ? "Cập nhật" : "Thêm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Achievement Detail Modal */}
      <Dialog open={isAchievementDetailOpen} onOpenChange={setIsAchievementDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết thành tích</DialogTitle>
            <DialogDescription>
              {loadingAchievementDetail ? "Đang tải..." : "Thông tin chi tiết về thành tích"}
            </DialogDescription>
          </DialogHeader>

          {achievementDetail && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{
                    background:
                      achievementDetail.position === 1 ? '#eab308' :
                        achievementDetail.position === 2 ? '#9ca3af' :
                          achievementDetail.position === 3 ? '#f97316' : '#3b82f6'
                  }}>
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{achievementDetail.competition_name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary">{achievementDetail.category}</Badge>
                    <Badge variant="outline">Hạng {achievementDetail.position}</Badge>
                    <Badge className="bg-purple-600 text-white">{achievementDetail.award}</Badge>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(new Date(achievementDetail.achieved_at))}</span>
              </div>

              {/* Description */}
              {achievementDetail.description && (
                <div className="rounded-md bg-muted/40 p-3 text-sm leading-relaxed">
                  {achievementDetail.description}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Project Modal */}
      <ProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectId={editingProjectId}
        initial={{
          title: projectForm.title,
          description: projectForm.description,
          category: projectForm.category,
          project_url: projectForm.project_url,
          github_url: projectForm.github_url,
        }}
        initialTags={selectedTags}
        onSubmit={async ({ formData, projectId }) => {
          if (projectId) {
            await dispatch(updateUserProject({ projectId, data: formData })).unwrap();
            toast({ title: "Thành công", description: "Đã cập nhật dự án" });
          } else {
            await dispatch(addUserProject(formData)).unwrap();
            toast({ title: "Thành công", description: "Đã thêm dự án" });
          }
          setEditingProjectId(null);
          setSelectedTags([]);
        }}
      />
    </div>
  );
}
