import { useState, useMemo, useEffect, useCallback } from "react";
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
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompetitionCard from "@/components/CompetitionCard";
import SearchFilters from "@/components/SearchFilters";
import { competitionCategories } from "@/lib/mockData";
import { SearchFilters as SearchFiltersType, Competition } from "@/types";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchCompetitions, fetchFeaturedCompetitions } from "@/services/features/competitions/competitionsSlice";

// Debounce function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export default function Index() {
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const { list, featured, isLoading } = useAppSelector((s) => s.competitions);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      dispatch(fetchCompetitions({ 
        page: 1, 
        limit: 30, 
        search: searchTerm,
        ...buildFilterParams(filters)
      }));
      setCurrentPage(1);
    }, 500),
    [dispatch, filters]
  );

  // Build filter parameters for API
  const buildFilterParams = (filterState: SearchFiltersType) => {
    const params: any = {};
    
    if (filterState.category?.length) {
      params.category = filterState.category[0]; // API supports single category
    }
    if (filterState.status?.length) {
      params.status = filterState.status[0]; // API supports single status
    }
    if (filterState.level?.length) {
      params.level = filterState.level[0]; // API supports single level
    }
    if (filterState.location) {
      params.location = filterState.location;
    }
    
    return params;
  };

  // Initial load
  useEffect(() => {
    dispatch(fetchCompetitions({ page: 1, limit: 30 }));
    dispatch(fetchFeaturedCompetitions({ page: 1, limit: 12 }));
  }, [dispatch]);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      dispatch(fetchCompetitions({ 
        page: 1, 
        limit: 30,
        ...buildFilterParams(filters)
      }));
      setCurrentPage(1);
    }
  }, [searchQuery, debouncedSearch, dispatch, filters]);

  // Handle filter changes
  useEffect(() => {
    dispatch(fetchCompetitions({ 
      page: 1, 
      limit: 30,
      search: searchQuery || undefined,
      ...buildFilterParams(filters)
    }));
    setCurrentPage(1);
  }, [filters, dispatch, searchQuery]);

  // Map API items (summary) to UI Competition card shape with safe defaults
  const mapToCard = (c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description || "",
    category: (c.category as any) || "programming",
    organizer: "",
    startDate: new Date(),
    endDate: new Date(),
    registrationDeadline: new Date(),
    location: "",
    isOnline: false,
    participants: 0,
    tags: [],
    requiredSkills: [],
    level: "beginner" as any,
    featured: !!c.featured,
    status: (c.status as any) || "upcoming",
    imageUrl: c.image_url || c.imageUrl,
  });
  const cardList = (list || []).map(mapToCard);
  const cardFeatured = (featured || []).map(mapToCard);

  // Server-side filtering - no need for client-side filtering
  const filteredCompetitions = cardList as any[];
  const featuredCompetitions = cardFeatured as any[];
  const upcomingCompetitions = cardList.filter((comp: any) => comp.status === "registration_open") as any[];
  const ongoingCompetitions = cardList.filter((comp: any) => comp.status === "in_progress") as any[];

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
                  <span>Hiển thị {filteredCompetitions.length} cuộc thi</span>
                </div>
              </div>

              <TabsContent value="all" className="space-y-6">
                {/* Search Input */}
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm cuộc thi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isLoading ? "Đang tải..." : `${filteredCompetitions.length} cuộc thi`}
                  </div>
                </div>

                <SearchFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onSearch={setSearchQuery}
                />

                {filteredCompetitions.length === 0 ? (
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
                        setFilters({});
                        setSearchQuery("");
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCompetitions.map((competition) => (
                      <CompetitionCard
                        key={competition.id}
                        competition={competition}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredCompetitions.map((competition) => (
                    <CompetitionCard
                      key={competition.id}
                      competition={competition}
                      variant="featured"
                    />
                  ))}
                </div>
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
