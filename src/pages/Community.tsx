import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Users,
  Search,
  Filter,
  MapPin,
  Star,
  CheckCircle,
  UserPlus,
  School,
  Trophy,
  Target,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  mockUsers,
  competitionCategories,
  skillCategories,
} from "@/lib/mockData";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";

export default function Community() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const { toast } = useToast();
  const { openChatWithUser } = useChat();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      user.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" ||
      user.skills.some((skill) => skill.category === selectedCategory);

    const matchesLocation =
      selectedLocation === "all" ||
      user.location.city
        .toLowerCase()
        .includes(selectedLocation.toLowerCase()) ||
      user.location.region
        .toLowerCase()
        .includes(selectedLocation.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "verified" && user.isVerified) ||
      (selectedFilter === "high-rated" && user.rating >= 4.5) ||
      (selectedFilter === "active" && user.achievements.length > 0);

    return matchesSearch && matchesCategory && matchesLocation && matchesFilter;
  });

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-blue-100 text-blue-700";
      case "advanced":
        return "bg-purple-100 text-purple-700";
      case "expert":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const UserCard = ({ user }: { user: User }) => {
    const [isInviting, setIsInviting] = useState(false);
    const [isMessaging, setIsMessaging] = useState(false);

    const handleInvite = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsInviting(true);
      
      // Mock API call
      setTimeout(() => {
        setIsInviting(false);
        toast({
          title: "Gửi lời mời thành công!",
          description: `Đã gửi lời mời đến ${user.fullName}. Họ sẽ nhận được thông báo.`,
        });
      }, 1000);
    };

    const handleMessage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMessaging(true);
      
      // Open chat with user
      setTimeout(() => {
        setIsMessaging(false);
        openChatWithUser(user.id, user.fullName);
      }, 500);
    };

    return (
      <Card className="card-hover cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
        <CardHeader className="pb-3">
          <div className="flex items-start space-x-4 w-full">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="text-lg">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg text-left mb-1 flex items-center gap-2">
                {user.fullName}
                {user.isVerified && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </h3>
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(user.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300",
                    )}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  ({user.rating})
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1 text-left">
                @{user.username}
              </p>
              <p className="text-sm text-muted-foreground mb-1 text-left flex items-center">
                <School className="h-4 w-4 mr-1" />
                {user.school}
              </p>
              <p className="text-sm text-muted-foreground mb-2 text-left flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location.city}
              </p>
              <p className="text-sm text-muted-foreground text-left">{user.bio}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-left">
          {/* Skills */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Kỹ năng chuyên môn</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 6).map((skill) => (
                <Badge
                  key={skill.name}
                  className={cn("text-xs", getSkillLevelColor(skill.level))}
                >
                  {skill.name} ({skill.experienceYears}y)
                </Badge>
              ))}
              {user.skills.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{user.skills.length - 6} kỹ năng khác
                </Badge>
              )}
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium">Quan tâm:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {user.achievements.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Thành tích nổi bật</span>
              </div>
              <div className="space-y-1">
                {user.achievements.slice(0, 2).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="text-xs bg-muted rounded p-2"
                  >
                    <div className="font-medium">
                      {achievement.competitionTitle}
                    </div>
                    <div className="text-muted-foreground">
                      {achievement.award} • Hạng {achievement.position}
                    </div>
                  </div>
                ))}
                {user.achievements.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{user.achievements.length - 2} thành tích khác
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1 text-xs text-muted-foreground mb-2">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Tham gia từ {formatJoinDate(user.joinDate)}
            </div>
            <div className="flex items-center">
              <span>Chuyên ngành: {user.studyField}</span>
            </div>
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button
              className="flex-1"
              onClick={handleInvite}
              disabled={isInviting}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isInviting ? "Đang mời..." : "Mời vào nhóm"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleMessage}
              disabled={isMessaging}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isMessaging ? "Đang gửi..." : "Nhắn tin"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container pt-12">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Tìm bạn thi
        </h1>
      </div>
      <div className="container py-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, trường, kỹ năng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lĩnh vực kỹ năng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lĩnh vực</SelectItem>
                {skillCategories.map((category) => (
                  <SelectItem
                    key={category.name}
                    value={category.name.toLowerCase()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả địa điểm</SelectItem>
                <SelectItem value="hà nội">Hà Nội</SelectItem>
                <SelectItem value="tp. hồ chí minh">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="đà nẵng">Đà Nẵng</SelectItem>
                <SelectItem value="hải phòng">Hải Phòng</SelectItem>
                <SelectItem value="cần thơ">Cần Thơ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* User Cards */}
        <div className="space-y-6">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Không tìm thấy thành viên phù hợp
                </h3>
                <p className="text-muted-foreground mb-4">
                  Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để tìm thêm thành
                  viên
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("all");
                    setSelectedCategory("all");
                    setSelectedLocation("all");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
