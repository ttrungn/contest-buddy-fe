import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Competition } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CompetitionThumbnail from "./CompetitionThumbnail";

interface CompetitionCardProps {
  competition: Competition;
  variant?: "default" | "featured" | "compact";
}

export default function CompetitionCard({
  competition,
  variant = "default",
}: CompetitionCardProps) {
  const navigate = useNavigate();

  const isDeadlineSoon = () => {
    const today = new Date();
    const deadline = new Date(competition.registrationDeadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const getStatusBadge = () => {
    switch (competition.status) {
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

  const getCategoryIcon = () => {
    const iconMap: Record<string, string> = {
      programming: "💻",
      design: "🎨",
      business: "💼",
      science: "🔬",
      mathematics: "📐",
      innovation: "💡",
      startup: "🚀",
      creative: "✨",
    };
    return iconMap[competition.category] || "🏆";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  if (variant === "compact") {
    return (
      <Card className="card-hover">
        <CardContent className="p-4 text-left">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{getCategoryIcon()}</div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm line-clamp-1 text-left">
                  {competition.title}
                </h3>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2 text-left">
                {competition.description}
              </p>
              <div className="flex items-center text-xs text-muted-foreground space-x-3 text-left">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(competition.registrationDeadline)}
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {competition.participants}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "card-hover group cursor-pointer",
        variant === "featured" &&
          "border-primary shadow-medium bg-gradient-to-br from-primary/5 to-purple-500/5",
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a[rel='noopener noreferrer']")) return;
        navigate(`/competition/${competition.id}`);
      }}
    >
      {/* Competition image or fallback */}
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
        {/* Deadline Warning Badge */}
        {isDeadlineSoon() && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-warning text-warning-foreground animate-pulse">
              <Clock className="h-3 w-3 mr-1" />
              Sắp hết hạn
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{getCategoryIcon()}</span>
              <Badge variant="secondary" className="text-xs">
                {competition.category}
              </Badge>
              <Badge
                variant={
                  competition.level === "expert" ? "destructive" : "outline"
                }
                className="text-xs"
              >
                {competition.level}
              </Badge>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors text-left">
              {competition.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 text-left">
              {competition.description}
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-left">
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>
              Hạn đăng ký: {formatDate(competition.registrationDeadline)}
            </span>
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
            {competition.maxParticipants && (
              <span className="text-muted-foreground">
                {" "}
                / {competition.maxParticipants}
              </span>
            )}
          </div>
          {competition.prizePool && (
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
              <span className="font-semibold text-foreground">
                {competition.prizePool}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {competition.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {competition.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{competition.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-3">
        <div className="text-xs text-muted-foreground">
          {competition.organizer}
        </div>
        <div className="flex space-x-2">
          {competition.website && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={competition.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Website
              </a>
            </Button>
          )}
          <Button size="sm" asChild>
            <Link to={`/competition/${competition.id}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
