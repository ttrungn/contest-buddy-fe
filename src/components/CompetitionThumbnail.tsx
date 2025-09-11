import { Trophy, Users, Calendar, MapPin } from "lucide-react";
import { Competition } from "@/types";
import { cn } from "@/lib/utils";

interface CompetitionThumbnailProps {
  competition: Competition;
  className?: string;
}

export default function CompetitionThumbnail({ competition, className }: CompetitionThumbnailProps) {
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

  const getCategoryColor = () => {
    const colorMap: Record<string, string> = {
      programming: "from-blue-500 to-cyan-500",
      design: "from-purple-500 to-pink-500",
      business: "from-green-500 to-emerald-500",
      science: "from-indigo-500 to-blue-500",
      mathematics: "from-orange-500 to-red-500",
      innovation: "from-yellow-500 to-orange-500",
      startup: "from-pink-500 to-rose-500",
      creative: "from-violet-500 to-purple-500",
    };
    return colorMap[competition.category] || "from-gray-500 to-gray-600";
  };

  const getStatusColor = () => {
    switch (competition.status) {
      case "registration-open":
        return "bg-green-500";
      case "ongoing":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      case "upcoming":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className={cn(
      "relative w-full h-48 bg-gradient-to-br rounded-t-lg overflow-hidden",
      getCategoryColor(),
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-6xl opacity-20">
          {getCategoryIcon()}
        </div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20">
          🏆
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-4 text-white">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{getCategoryIcon()}</div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                {competition.category}
              </span>
              <div className={cn(
                "w-2 h-2 rounded-full mt-1",
                getStatusColor()
              )} />
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs font-medium">
              {competition.status === "registration-open" && "Đang mở đăng ký"}
              {competition.status === "ongoing" && "Đang diễn ra"}
              {competition.status === "completed" && "Đã kết thúc"}
              {competition.status === "upcoming" && "Sắp diễn ra"}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="flex-1 flex items-center">
          <h3 className="text-lg font-bold leading-tight line-clamp-2">
            {competition.title}
          </h3>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-sm opacity-90">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{competition.participants}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-20">
                {competition.location}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(competition.startDate)}</span>
          </div>
        </div>

        {/* Prize Pool Badge */}
        {competition.prizePool && (
          <div className="absolute top-3 left-3">
            <div className="bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 text-xs font-bold">
              <Trophy className="h-3 w-3 inline mr-1" />
              {competition.prizePool}
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {competition.featured && (
          <div className="absolute top-3 right-3">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
              ⭐ Nổi bật
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 