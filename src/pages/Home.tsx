import CompetitionCard from "@/components/CompetitionCard";
import { mockCompetitions, mockUsers, competitionCategories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, School, MapPin, Star, Target, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Trophy, Users } from "lucide-react";

function UserCard({ user }) {
  const navigate = useNavigate();
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
            <div className="space-y-1 text-xs text-muted-foreground mb-2">
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Tham gia từ {user.joinDate ? new Date(user.joinDate).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : ''}
              </div>
              <div className="flex items-center">
                <span>Chuyên ngành: {user.studyField}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const competitions = mockCompetitions.slice(0, 5);
  const users = mockUsers.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-competition-hero py-20">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16" />
        <div className="container relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              🎉 Mới: Tích hợp lịch Google Calendar
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Nền tảng cuộc thi <br />
              <span className="text-white/90">hàng đầu Việt Nam</span>
            </h1>
            <p className="mb-8 text-lg text-white/80 sm:text-xl max-w-2xl mx-auto">
              Khám phá, tham gia và kết nối với hàng nghìn cuộc thi chất lượng. Xây dựng portfolio cá nhân và tìm kiếm đối tác phù hợp với kỹ năng của bạn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-competition hover:bg-white/90"
              >
                <Search className="mr-2 h-5 w-5" />
                Khám phá cuộc thi
              </Button>
              <Button
                size="lg"
                className="bg-white text-competition hover:bg-white/90"
                asChild
              >
                <Link to="/community">
                  Tìm bạn thi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="container py-8 space-y-12">
        {/* Competition Thumbnail Section */}
        <section>
          <h2 className="text-3xl font-extrabold mb-4 inline-block border-b-4 border-primary pb-1 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Khám phá cuộc thi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-4">
            {competitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
          <Button onClick={() => navigate("/")}>Xem thêm cuộc thi</Button>
        </section>

        {/* Friend Suggestion Section */}
        <section>
          <h2 className="text-3xl font-extrabold mb-4 inline-block border-b-4 border-primary pb-1 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Tìm bạn thi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-4">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          <Button onClick={() => navigate("/community")}>Xem thêm bạn thi</Button>
        </section>
        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Khám phá theo lĩnh vực</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tìm kiếm cuộc thi phù hợp với sở thích và kỹ năng của bạn
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {competitionCategories.map((category) => (
                <Card
                  key={category.name}
                  className="group cursor-pointer card-hover text-center p-4"
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    {category.label}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Tại sao chọn Contest Buddy?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nền tảng toàn diện giúp bạn phát triển kỹ năng và xây dựng mạng lưới
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Gợi ý thông minh</h3>
                <p className="text-sm text-muted-foreground">
                  Thuật toán AI gợi ý cuộc thi và đối tác phù hợp với kỹ năng, trường học và khu vực của bạn
                </p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Portfolio cá nhân</h3>
                <p className="text-sm text-muted-foreground">
                  Xây dựng hồ sơ công khai với thành tích, kỹ năng và nhận đánh giá từ cộng đồng
                </p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Quản lý lịch thi</h3>
                <p className="text-sm text-muted-foreground">
                  Tự động đồng bộ với Google Calendar và nhận thông báo deadline theo cài đặt cá nhân
                </p>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 