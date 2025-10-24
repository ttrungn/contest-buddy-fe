import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Star,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompetitionCard from "@/components/CompetitionCard";
import SearchFilters from "@/components/SearchFilters";
import { CompetitionFilters, Competition } from "@/types";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchCompetitions, fetchFeaturedCompetitions } from "@/services/features/competitions/competitionsSlice";

// Debounce utility function for API calls
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export default function Index() {
  const dispatch = useAppDispatch();
  const { list, featured, isLoading, pagination } = useAppSelector((s) => s.competitions);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  // Simple filter state (no URL synchronization)
  const [filters, setFilters] = useState<CompetitionFilters>({});
  // Removed top-level search input; SearchFilters contains the search box

  // Debounced API call function
  const debouncedFetchCompetitions = useCallback(
    debounce((filterParams: CompetitionFilters) => {
      dispatch(fetchCompetitions({
        page: 1,
        limit: 30,
        ...filterParams,
      }));
    }, 500),
    [dispatch]
  );

  // Initial load
  useEffect(() => {
    // Load competitions with initial filters
    dispatch(fetchCompetitions({
      page: 1,
      limit: 30,
      ...filters,
    }));

    // Load featured competitions
    dispatch(fetchFeaturedCompetitions({ page: 1, limit: 12 }));
  }, [dispatch, filters.category, filters.status, filters.level, filters.start_date, filters.end_date, filters.location, filters.isOnline, filters.prizePool]);

  const handleFiltersChange = (newFilters: CompetitionFilters) => {
    setFilters(newFilters);
    // For search queries, use debounced API call
    if (newFilters.search !== filters.search) {
      debouncedFetchCompetitions(newFilters);
    } else {
      // For other filters, call immediately
      dispatch(fetchCompetitions({
        page: 1,
        limit: 12,
        ...newFilters,
      }));
    }
  };

  // Map API items (summary) to UI Competition card shape with safe defaults
  const mapToCard = (c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description || "",
    category: (c.category as any) || "programming",
    organizer: "",
    startDate: c.start_date ? new Date(c.start_date) : new Date(),
    endDate: c.end_date ? new Date(c.end_date) : new Date(),
    registrationDeadline: c.registration_deadline ? new Date(c.registration_deadline) : new Date(),
    location: c.location || "",
    isOnline: false,
    participants: c.participants_count || 0,
    tags: c.competitionTags || [],
    requiredSkills: c.competitionRequiredSkills || [],
    level: (c.level as any) || "beginner",
    featured: !!c.featured,
    status: (c.status as any) || "upcoming",
    imageUrl: c.image_url || c.imageUrl,
  });

  // Use API data directly (no client-side filtering)
  // Normalize status from API (supports Vietnamese labels)
  const normalizeStatus = (status: string | undefined | null): string => {
    if (!status) return "registration_open";
    const raw = String(status);
    const lower = raw.toLowerCase();
    const known = [
      "registration_open",
      "registration_closed",
      "in_progress",
      "ongoing",
      "completed",
      "cancelled",
    ];
    if (known.includes(lower)) return lower;
    switch (raw) {
      case "Đang mở đăng ký":
        return "registration_open";
      case "Đã đóng đăng ký":
        return "registration_closed";
      case "Đang diễn ra":
        return "in_progress";
      case "Đã hoàn thành":
      case "Hoàn thành":
        return "completed";
      case "Đã hủy":
        return "cancelled";
      default:
        return lower;
    }
  };

  const competitions = (list || []).map((c: any) => {
    const mapped = mapToCard(c) as any;
    mapped.status = normalizeStatus(c.status) as any;
    return mapped as any;
  });
  const featuredCompetitions = (featured || []).map(mapToCard);

  // Filter featured and status-based competitions from API data
  const upcomingCompetitions = competitions.filter((comp: any) => comp.status === "registration_open");
  const ongoingCompetitions = competitions.filter((comp: any) => comp.status === "in_progress" || comp.status === "ongoing");

  const stats = [
    {
      title: "Cuộc thi đang diễn ra",
      value: ongoingCompetitions.length,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Thành viên hoạt động",
      value: "15.2K",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Cuộc thi tuần này",
      value: upcomingCompetitions.length,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Tổng giải thưởng",
      value: "2.5B VNĐ",
      icon: Trophy,
      color: "text-yellow-600",
    },
  ];

  const isAdmin = false;
  return (
    <div className="min-h-screen bg-background">
      <div className="container pt-12">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Tìm kiếm cuộc thi
        </h1>
      </div>
      {/* Main Content */}
      <section className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          {isAdmin ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Quản lý hệ thống</h2>
                <p className="text-muted-foreground mb-8">
                  Chọn chức năng bạn muốn quản lý
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/admin/competitions">
                  <Card className="card-hover">
                    <CardContent className="pt-6 text-center">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="font-semibold mb-2">Quản lý cuộc thi</h3>
                      <p className="text-sm text-muted-foreground">
                        Tạo, chỉnh sửa và quản lý các cuộc thi
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/admin/users">
                  <Card className="card-hover">
                    <CardContent className="pt-6 text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <h3 className="font-semibold mb-2">Quản lý người dùng</h3>
                      <p className="text-sm text-muted-foreground">
                        Quản lý tài khoản và quyền người dùng
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/admin/reports">
                  <Card className="card-hover">
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                      <h3 className="font-semibold mb-2">Báo cáo</h3>
                      <p className="text-sm text-muted-foreground">
                        Xem báo cáo và thống kê hệ thống
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/admin/analytics">
                  <Card className="card-hover">
                    <CardContent className="pt-6 text-center">
                      <Target className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
                      <h3 className="font-semibold mb-2">Phân tích</h3>
                      <p className="text-sm text-muted-foreground">
                        Phân tích dữ liệu và hiệu suất
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="all" className="space-y-8">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-fit grid-cols-4 lg:w-auto">
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="featured">Nổi bật</TabsTrigger>
                  <TabsTrigger value="registration">Đang mở</TabsTrigger>
                  <TabsTrigger value="ongoing">Đang diễn ra</TabsTrigger>
                </TabsList>

                <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Hiển thị {competitions.length} cuộc thi</span>
                </div>
              </div>

              <TabsContent value="all" className="space-y-6">
                {/* Search input removed - SearchFilters handles searching */}

                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span>Đang tải danh sách cuộc thi...</span>
                    </div>
                  </div>
                ) : competitions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    <Button
                      onClick={() => {
                        const clearedFilters = {} as any;
                        setFilters(clearedFilters);
                        handleFiltersChange(clearedFilters);
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {competitions.map((competition) => (
                      <CompetitionCard
                        key={competition.id}
                        competition={competition}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured" className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span>Đang tải cuộc thi nổi bật...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {featuredCompetitions.map((competition) => (
                      <CompetitionCard
                        key={competition.id}
                        competition={competition}
                        variant="featured"
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="registration" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {upcomingCompetitions.map((competition) => (
                    <CompetitionCard
                      key={competition.id}
                      competition={competition}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ongoing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {ongoingCompetitions.map((competition) => (
                    <CompetitionCard
                      key={competition.id}
                      competition={competition}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

    </div>
  );
}
