import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/services/store/store";
import { fetchCommunityProfiles, updateFilters, clearFilters } from "@/services/features/community/communitySlice";
import { CommunityFilters } from "@/interfaces/ICommunity";
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
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { CommunityUser } from "@/interfaces/ICommunity";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";

// Debounce utility function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export default function Community() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users: communityUsers, pagination, isLoading, error, currentFilters } = useSelector((state: RootState) => state.community);
  
  // Local filter state for form inputs
  const [localFilters, setLocalFilters] = useState<CommunityFilters>({
    search: "",
    city: "",
    region: "",
    country: "",
    school: "",
    study_field: "",
    min_rating: undefined,
    max_rating: undefined,
    is_verified: undefined,
    join_date_from: "",
    join_date_to: "",
    skill_name: "",
    skill_category: "",
    skill_level: "",
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { toast } = useToast();
  const { openChatWithUser } = useChat();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((filters: CommunityFilters) => {
      dispatch(updateFilters(filters));
      dispatch(fetchCommunityProfiles({ ...currentFilters, ...filters, page: 1 }));
    }, 500),
    [dispatch, currentFilters]
  );

  // Apply filters immediately for non-text inputs
  const applyFilters = (newFilters: Partial<CommunityFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    dispatch(updateFilters(updatedFilters));
    dispatch(fetchCommunityProfiles({ ...currentFilters, ...updatedFilters, page: 1 }));
  };

  // Apply text search with debouncing
  const applyTextSearch = (newFilters: Partial<CommunityFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    debouncedSearch(updatedFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: CommunityFilters = {
      search: "",
      city: "",
      region: "",
      country: "",
      school: "",
      study_field: "",
      min_rating: undefined,
      max_rating: undefined,
      is_verified: undefined,
      join_date_from: "",
      join_date_to: "",
      skill_name: "",
      skill_category: "",
      skill_level: "",
    };
    setLocalFilters(clearedFilters);
    dispatch(clearFilters());
    dispatch(fetchCommunityProfiles({ page: 1, limit: 20 }));
  };

  // Fetch community profiles on component mount
  useEffect(() => {
    dispatch(fetchCommunityProfiles(currentFilters));
  }, [dispatch]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    dispatch(updateFilters({ page }));
    dispatch(fetchCommunityProfiles({ ...currentFilters, page }));
  };

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

  const UserCard = ({ user }: { user: CommunityUser }) => {
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
        openChatWithUser(user.userId, user.fullName);
      }, 500);
    };

    return (
      <Card className="card-hover cursor-pointer h-full flex flex-col" onClick={() => navigate(`/user/${user.userId}`)}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start space-x-4 w-full">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback className="text-lg">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
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
                <School className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{user.school}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2 text-left flex items-center">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{user.city}, {user.region}</span>
              </p>
              <p className="text-sm text-muted-foreground text-left line-clamp-2">{user.bio}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-left flex-1 flex flex-col justify-between">{/* Skills */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Kỹ năng chuyên môn</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.skills.slice(0, 3).map((skill, index) => (
                  <Badge
                    key={index}
                    className={cn("text-xs", getSkillLevelColor(skill.level))}
                  >
                    {skill.skillName} ({skill.experienceYears}y)
                  </Badge>
                ))}
                {user.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    ...
                  </Badge>
                )}
              </div>
            </div>

            {/* Study Field */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium">Chuyên ngành:</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user.studyField}
              </Badge>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground mb-2">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Tham gia từ {formatJoinDate(new Date(user.joinDate))}
              </div>
              <div className="flex items-center">
                <span>Quốc gia: {user.country}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <Separator className="mb-4" />
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
          {/* Primary Search and Quick Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, username, email..."
                value={localFilters.search || ""}
                onChange={(e) => applyTextSearch({ search: e.target.value })}
                className="pl-10"
              />
            </div>
            <Select
              value={localFilters.is_verified === true ? "verified" : localFilters.is_verified === false ? "unverified" : "all"}
              onValueChange={(value) => {
                const is_verified = value === "verified" ? true : value === "unverified" ? false : undefined;
                applyFilters({ is_verified });
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Xác minh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="verified">Đã xác minh</SelectItem>
                <SelectItem value="unverified">Chưa xác minh</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc nâng cao</span>
            </Button>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Xóa bộ lọc</span>
            </Button>
          </div>

          {/* Advanced Filters */}
          <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <CollapsibleContent className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Bộ lọc nâng cao</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Text Search Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tên kỹ năng</label>
                      <Input
                        placeholder="React, Python, JavaScript..."
                        value={localFilters.skill_name || ""}
                        onChange={(e) => applyTextSearch({ skill_name: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Location Filters */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Bộ lọc địa điểm</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Thành phố</label>
                        <Input
                          placeholder="Hà Nội, TP. HCM..."
                          value={localFilters.city || ""}
                          onChange={(e) => applyTextSearch({ city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Vùng/Bang</label>
                        <Input
                          placeholder="Miền Bắc, Miền Nam..."
                          value={localFilters.region || ""}
                          onChange={(e) => applyTextSearch({ region: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Quốc gia</label>
                        <Input
                          placeholder="Việt Nam, USA..."
                          value={localFilters.country || ""}
                          onChange={(e) => applyTextSearch({ country: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Education Filters */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                      <School className="h-4 w-4" />
                      <span>Bộ lọc giáo dục</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Trường học</label>
                        <Input
                          placeholder="PTIT, FPT, VNU..."
                          value={localFilters.school || ""}
                          onChange={(e) => applyTextSearch({ school: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ngành học</label>
                        <Input
                          placeholder="Công nghệ thông tin, Khoa học máy tính..."
                          value={localFilters.study_field || ""}
                          onChange={(e) => applyTextSearch({ study_field: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating and Skills Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rating Filter */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                        <Star className="h-4 w-4" />
                        <span>Bộ lọc đánh giá</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Đánh giá tối thiểu</label>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="0.0"
                            value={localFilters.min_rating || ""}
                            onChange={(e) => {
                              const value = e.target.value ? parseFloat(e.target.value) : undefined;
                              applyFilters({ min_rating: value });
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Đánh giá tối đa</label>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="5.0"
                            value={localFilters.max_rating || ""}
                            onChange={(e) => {
                              const value = e.target.value ? parseFloat(e.target.value) : undefined;
                              applyFilters({ max_rating: value });
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills Filter */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Bộ lọc kỹ năng</span>
                      </h4>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Cấp độ kỹ năng</label>
                        <Select
                          value={localFilters.skill_level || "all"}
                          onValueChange={(value) => applyFilters({ skill_level: value === "all" ? "" : value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cấp độ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả cấp độ</SelectItem>
                            <SelectItem value="beginner">Người mới</SelectItem>
                            <SelectItem value="intermediate">Trung cấp</SelectItem>
                            <SelectItem value="advanced">Nâng cao</SelectItem>
                            <SelectItem value="expert">Chuyên gia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Bộ lọc thời gian tham gia</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Từ ngày</label>
                        <Input
                          type="date"
                          value={localFilters.join_date_from || ""}
                          onChange={(e) => applyFilters({ join_date_from: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Đến ngày</label>
                        <Input
                          type="date"
                          value={localFilters.join_date_to || ""}
                          onChange={(e) => applyFilters({ join_date_to: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* User Cards */}
        <div className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span>Đang tải danh sách thành viên...</span>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-semibold mb-2 text-red-600">
                  Lỗi tải danh sách thành viên
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => dispatch(fetchCommunityProfiles(currentFilters))}>
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          ) : communityUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Không tìm thấy thành viên nào
                </h3>
                <p className="text-muted-foreground mb-4">
                  Không có thành viên nào phù hợp với bộ lọc hiện tại
                </p>
                <Button onClick={clearAllFilters}>
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {communityUsers.map((user) => (
                <UserCard key={user.userId} user={user} />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, (pagination.page || 1) - 1))}
                disabled={!pagination.hasPreviousPage || isLoading}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Trước</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                {/* First page */}
                {(pagination.page || 1) > 3 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={isLoading}
                    >
                      1
                    </Button>
                    {(pagination.page || 1) > 4 && <span className="px-2">...</span>}
                  </>
                )}
                
                {/* Pages around current page */}
                {(() => {
                  const currentPage = pagination.page || 1;
                  const startPage = Math.max(1, currentPage - 2);
                  const endPage = Math.min(pagination.totalPages, currentPage + 2);
                  
                  // Adjust startPage to avoid showing "1" twice
                  const adjustedStartPage = currentPage > 3 ? Math.max(startPage, 2) : startPage;
                  // Adjust endPage to avoid showing last page twice
                  const adjustedEndPage = currentPage < pagination.totalPages - 2 ? Math.min(endPage, pagination.totalPages - 1) : endPage;
                  
                  const pages = [];
                  
                  for (let i = adjustedStartPage; i <= adjustedEndPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        disabled={isLoading}
                      >
                        {i}
                      </Button>
                    );
                  }
                  
                  return pages;
                })()}
                
                {/* Last page */}
                {(pagination.page || 1) < pagination.totalPages - 2 && (
                  <>
                    {(pagination.page || 1) < pagination.totalPages - 3 && <span className="px-2">...</span>}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={isLoading}
                    >
                      {pagination.totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(pagination.totalPages, (pagination.page || 1) + 1))}
                disabled={!pagination.hasNextPage || isLoading}
                className="flex items-center space-x-1"
              >
                <span>Sau</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Pagination Info */}
          {pagination && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} thành viên
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
