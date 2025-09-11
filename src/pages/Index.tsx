import { useState, useMemo } from "react";
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
import { mockCompetitions, competitionCategories } from "@/lib/mockData";
import { SearchFilters as SearchFiltersType, Competition } from "@/types";
import { useUserRole } from "@/contexts/UserRoleContext";

export default function Index() {
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin } = useUserRole();

  const filteredCompetitions = useMemo(() => {
    let filtered = mockCompetitions;

    // Search by query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (comp) =>
          comp.title.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query) ||
          comp.organizer.toLowerCase().includes(query) ||
          comp.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply filters
    if (filters.category?.length) {
      filtered = filtered.filter((comp) =>
        filters.category!.includes(comp.category),
      );
    }

    if (filters.level?.length) {
      filtered = filtered.filter((comp) => filters.level!.includes(comp.level));
    }

    if (filters.status?.length) {
      filtered = filtered.filter((comp) =>
        filters.status!.includes(comp.status),
      );
    }

    if (filters.isOnline !== undefined) {
      filtered = filtered.filter((comp) => comp.isOnline === filters.isOnline);
    }

    if (filters.prizePool) {
      filtered = filtered.filter((comp) => comp.prizePool);
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter((comp) =>
        comp.location.toLowerCase().includes(location),
      );
    }

    return filtered;
  }, [filters, searchQuery, mockCompetitions]);

  const featuredCompetitions = mockCompetitions.filter((comp) => comp.featured);
  const upcomingCompetitions = mockCompetitions.filter(
    (comp) => comp.status === "registration-open",
  );
  const ongoingCompetitions = mockCompetitions.filter(
    (comp) => comp.status === "ongoing",
  );

  const stats = [
    {
      title: "Cuộc thi đang diễn ra",
      value: mockCompetitions.filter((c) => c.status === "ongoing").length,
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
      value: mockCompetitions.filter((c) => c.status === "registration-open")
        .length,
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
