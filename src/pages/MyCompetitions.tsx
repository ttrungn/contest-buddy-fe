import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Bookmark, Calendar, MapPin, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CompetitionCard from "@/components/CompetitionCard";
import CompetitionThumbnail from "@/components/CompetitionThumbnail";
import { mockCompetitions } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { api } from "@/services/constant/axiosInstance";
import { USER_PARTICIPATED_COMPETITIONS_ENDPOINT } from "@/services/constant/apiConfig";

export default function MyCompetitions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for API data
  const [participatedCompetitions, setParticipatedCompetitions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock current user (in real app, this would come from auth context)
  const currentUser = { id: "1" };

  // API function to fetch participated competitions
  const fetchParticipatedCompetitions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(USER_PARTICIPATED_COMPETITIONS_ENDPOINT);
      
      // Handle the API response structure from your example
      if (response && response.success && response.data) {
        setParticipatedCompetitions(response.data);
      } else {
        setParticipatedCompetitions([]);
      }
    } catch (error: any) {
      console.error("Error fetching participated competitions:", error);
      setError("Không thể tải danh sách cuộc thi đã tham gia");
      setParticipatedCompetitions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchParticipatedCompetitions();
  }, []);

  // Mock interested competitions (in real app, this would come from API)
  const interestedCompetitionIds = ["1", "3"];

  // Get registered competitions from API data
  const registeredCompetitions = participatedCompetitions;

  // Get interested competitions from mock data for now
  const interestedCompetitions = mockCompetitions.filter(comp =>
    interestedCompetitionIds.includes(comp.id)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registration_open":
      case "published":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Đang mở đăng ký
          </Badge>
        );
      case "upcoming":
        return <Badge variant="secondary">Sắp diễn ra</Badge>;
      case "in_progress":
      case "ongoing":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return <Badge variant="outline">Đã kết thúc</Badge>;
      case "registration_closed":
        return <Badge variant="outline">Đã đóng đăng ký</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return "--/--";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "--/--";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  // Handler for bookmark
  const handleBookmark = (competition: any) => {
    toast({
      title: "Đã lưu vào mục quan tâm!",
      description: `Bạn đã lưu cuộc thi '${competition.title}' vào mục quan tâm.`
    });
  };

  // Handler for register
  const handleRegister = (competition: any) => {
    navigate(`/competition/${competition.id}`);
    // Optionally: trigger registration modal via context or query param
  };

  // Handler for view detail
  const handleViewDetail = (competition: any) => {
    navigate(`/competition/${competition.id}`);
  };

  // Handler for explore
  const handleExplore = () => {
    navigate("/");
  };

  // Debug logging
  console.log("Render state:", { 
    isLoading, 
    error, 
    participatedCompetitions: participatedCompetitions.length,
    registeredCompetitions: registeredCompetitions.length 
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cuộc thi của tôi</h1>
              <p className="text-muted-foreground">
                Quản lý các cuộc thi bạn đã đăng ký và quan tâm
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="registered" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="registered" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Đã đăng ký ({isLoading ? "..." : registeredCompetitions.length})
            </TabsTrigger>
            <TabsTrigger value="interested" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Quan tâm ({interestedCompetitions.length})
            </TabsTrigger>
          </TabsList>

          {/* Registered Competitions Tab */}
          <TabsContent value="registered" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Đang tải danh sách cuộc thi...</p>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchParticipatedCompetitions}>
                      Thử lại
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : registeredCompetitions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredCompetitions.map((item) => {
                  const competition = item.competition;
                  const participation = item.participation;
                  
                  return (
                    <Card key={competition.id} className="card-hover h-full flex flex-col">
                      <div className="relative">
                        {competition.image_url ? (
                          <img
                            src={competition.image_url}
                            alt={competition.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                            onError={e => { (e.target as HTMLImageElement).src = "/thi.png"; }}
                          />
                        ) : (
                          <img
                            src="/thi.png"
                            alt="Default Competition Thumbnail"
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        )}
                      </div>
                      <CardHeader className="pb-3 flex-shrink-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {competition.category}
                              </Badge>
                              {getStatusBadge(competition.status)}
                            </div>
                            <h3 className="font-bold text-lg mb-2">
                              {competition.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {competition.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 flex-1 flex flex-col">
                        <div className="text-sm text-muted-foreground space-y-2 flex-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <span>Hạn đăng ký: {formatDate(competition.registration_deadline)}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            <span>
                              {competition.location}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            <span>{competition.participants_count} người tham gia</span>
                          </div>
                        </div>
                        {/* Registration Info */}
                        {participation && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-700 font-medium">Đã đăng ký</span>
                              <span className="text-green-600">
                                {formatDate(participation.registrationDate)}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="mt-auto">
                          <Button className="w-full" variant="outline" onClick={() => handleViewDetail(competition)}>
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa đăng ký cuộc thi nào</h3>
                    <p className="text-muted-foreground mb-4">
                      Bạn chưa đăng ký tham gia cuộc thi nào. Hãy khám phá các cuộc thi phù hợp!
                    </p>
                    <Button onClick={handleExplore}>
                      Khám phá cuộc thi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Interested Competitions Tab */}
          <TabsContent value="interested" className="space-y-6">
            {interestedCompetitions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interestedCompetitions.map((competition) => (
                  <Card key={competition.id} className="card-hover h-full flex flex-col">
                    <div className="relative">
                      {competition.imageUrl ? (
                        <img
                          src={competition.imageUrl}
                          alt={competition.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={e => { (e.target as HTMLImageElement).src = "/thi.png"; }}
                        />
                      ) : (
                        <img
                          src="/thi.png"
                          alt="Default Competition Thumbnail"
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                    </div>
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {competition.category}
                            </Badge>
                            {getStatusBadge(competition.status)}
                          </div>
                          <h3 className="font-bold text-lg mb-2">
                            {competition.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {competition.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 flex flex-col">
                      <div className="text-sm text-muted-foreground space-y-2 flex-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>Hạn đăng ký: {formatDate(competition.registrationDeadline)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span>
                            {competition.location} {competition.isOnline && "(Online)"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          <span>{competition.participants} người tham gia</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button className="flex-1" onClick={() => handleRegister(competition)}>
                          Đăng ký tham gia
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleBookmark(competition)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có cuộc thi quan tâm</h3>
                    <p className="text-muted-foreground mb-4">
                      Bạn chưa đánh dấu cuộc thi nào là quan tâm. Hãy bookmark những cuộc thi bạn thích!
                    </p>
                    <Button onClick={handleExplore}>
                      Khám phá cuộc thi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 