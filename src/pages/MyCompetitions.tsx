import { useState } from "react";
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

export default function MyCompetitions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Mock current user (in real app, this would come from auth context)
  const currentUser = { id: "1" };

  // Mock user registrations (in real app, this would come from API)
  const userRegistrations = [
    { competitionId: "2", teamId: "1", registeredAt: new Date("2024-01-15") },
  ];

  // Mock interested competitions (in real app, this would come from API)
  const interestedCompetitionIds = ["1", "3"];

  // Get registered competitions
  const registeredCompetitions = mockCompetitions.filter(comp =>
    userRegistrations.some(reg => reg.competitionId === comp.id)
  );

  // Get interested competitions
  const interestedCompetitions = mockCompetitions.filter(comp =>
    interestedCompetitionIds.includes(comp.id)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registration-open":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Đang mở đăng ký
          </Badge>
        );
      case "upcoming":
        return <Badge variant="secondary">Sắp diễn ra</Badge>;
      case "ongoing":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return <Badge variant="outline">Đã kết thúc</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
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
              Đã đăng ký ({registeredCompetitions.length})
            </TabsTrigger>
            <TabsTrigger value="interested" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Quan tâm ({interestedCompetitions.length})
            </TabsTrigger>
          </TabsList>

          {/* Registered Competitions Tab */}
          <TabsContent value="registered" className="space-y-6">
            {registeredCompetitions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredCompetitions.map((competition) => {
                  const registration = userRegistrations.find(
                    reg => reg.competitionId === competition.id
                  );
                  
                  return (
                    <Card key={competition.id} className="card-hover">
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
                      <CardHeader className="pb-3">
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
                      <CardContent className="space-y-3">
                        <div className="text-sm text-muted-foreground space-y-2">
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
                        {/* Registration Info */}
                        {registration && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-700 font-medium">Đã đăng ký</span>
                              <span className="text-green-600">
                                {formatDate(registration.registeredAt)}
                              </span>
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              Mã nhóm: #{registration.teamId}
                            </div>
                          </div>
                        )}
                        <Button className="w-full" variant="outline" onClick={() => handleViewDetail(competition)}>
                          Xem chi tiết
                        </Button>
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
                  <Card key={competition.id} className="card-hover">
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
                    <CardHeader className="pb-3">
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
                    <CardContent className="space-y-3">
                      <div className="text-sm text-muted-foreground space-y-2">
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
                      <div className="flex gap-2">
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