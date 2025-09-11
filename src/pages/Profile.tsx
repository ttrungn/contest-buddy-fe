import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockUsers, skillCategories } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Profile() {
  const [activeUser] = useState(mockUsers[0]); // Mock current user
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center md:text-left">
                <Avatar className="h-24 w-24 mb-4">
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
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4">{activeUser.bio}</p>

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
                      {activeUser.portfolio.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Kỹ năng chuyên môn
                    </span>
                    <span className="font-semibold">
                      {activeUser.skills.length}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeUser.skills.slice(0, 4).map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {getSkillLevelLabel(skill.level)}
                        </span>
                      </div>
                      <Progress
                        value={getSkillLevelProgress(skill.level)}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thành tích thi đấu</CardTitle>
                  <Badge variant="secondary">
                    {activeUser.achievements.length} cuộc thi
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeUser.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
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
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm dự án
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeUser.portfolio.map((item) => (
                    <Card key={item.id} className="card-hover">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {item.title}
                          </CardTitle>
                          {item.featured && (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              ⭐ Nổi bật
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.date)}
                          </span>
                          <div className="flex gap-2">
                            {item.githubUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={item.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Github className="h-3 w-3 mr-1" />
                                  Code
                                </a>
                              </Button>
                            )}
                            {item.projectUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={item.projectUrl}
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
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm kỹ năng
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillCategories.map((category) => {
                    const categorySkills = activeUser.skills.filter(
                      (skill) => skill.category === category.name.toLowerCase(),
                    );

                    if (categorySkills.length === 0) return null;

                    return (
                      <div key={category.name}>
                        <h3 className="font-semibold mb-3 text-lg">
                          {category.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categorySkills.map((skill) => (
                            <div
                              key={skill.name}
                              className="p-4 rounded-lg border"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                  {skill.name}
                                </span>
                                <Badge variant="outline">
                                  {getSkillLevelLabel(skill.level)}
                                </Badge>
                              </div>
                              <Progress
                                value={getSkillLevelProgress(skill.level)}
                                className="mb-2"
                              />
                              <div className="text-xs text-muted-foreground">
                                {skill.experienceYears} năm kinh nghiệm
                                {skill.certifications &&
                                  skill.certifications.length > 0 && (
                                    <span>
                                      {" "}
                                      • {skill.certifications.length} chứng chỉ
                                    </span>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {category.name !==
                          skillCategories[skillCategories.length - 1].name && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
