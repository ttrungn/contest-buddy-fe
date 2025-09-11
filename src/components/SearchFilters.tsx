import { useState } from "react";
import {
  Search,
  Filter,
  X,
  CalendarDays,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SearchFilters as SearchFiltersType } from "@/types";
import { competitionCategories } from "@/lib/mockData";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onSearch: (query: string) => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.category || [];
    const newCategories = checked
      ? [...currentCategories, category as any]
      : currentCategories.filter((c) => c !== category);

    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    const currentLevels = filters.level || [];
    const newLevels = checked
      ? [...currentLevels, level as any]
      : currentLevels.filter((l) => l !== level);

    onFiltersChange({
      ...filters,
      level: newLevels.length > 0 ? newLevels : undefined,
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status as any]
      : currentStatuses.filter((s) => s !== status);

    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setSearchQuery("");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category?.length) count++;
    if (filters.level?.length) count++;
    if (filters.status?.length) count++;
    if (filters.location) count++;
    if (filters.isOnline !== undefined) count++;
    if (filters.prizePool) count++;
    return count;
  };

  const levels = [
    { value: "beginner", label: "Người mới bắt đầu" },
    { value: "intermediate", label: "Trung cấp" },
    { value: "advanced", label: "Nâng cao" },
    { value: "expert", label: "Chuyên gia" },
  ];

  const statuses = [
    { value: "registration-open", label: "Đang mở đăng ký" },
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "ongoing", label: "Đang diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cuộc thi theo tên, mô tả, kỹ năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Tìm kiếm</Button>
      </form>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Bộ lọc
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Bộ lọc tìm kiếm</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Xóa tất cả
                  </Button>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Lĩnh vực
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {competitionCategories.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.name}`}
                          checked={
                            filters.category?.includes(category.name as any) ||
                            false
                          }
                          onCheckedChange={(checked) =>
                            handleCategoryChange(
                              category.name,
                              checked as boolean,
                            )
                          }
                        />
                        <Label
                          htmlFor={`category-${category.name}`}
                          className="text-sm flex items-center gap-1"
                        >
                          <span>{category.icon}</span>
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Level */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Cấp độ
                  </Label>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <div
                        key={level.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`level-${level.value}`}
                          checked={
                            filters.level?.includes(level.value as any) || false
                          }
                          onCheckedChange={(checked) =>
                            handleLevelChange(level.value, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`level-${level.value}`}
                          className="text-sm"
                        >
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Status */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Trạng thái
                  </Label>
                  <div className="space-y-2">
                    {statuses.map((status) => (
                      <div
                        key={status.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`status-${status.value}`}
                          checked={
                            filters.status?.includes(status.value as any) ||
                            false
                          }
                          onCheckedChange={(checked) =>
                            handleStatusChange(status.value, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`status-${status.value}`}
                          className="text-sm"
                        >
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Additional Filters */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="online"
                      checked={filters.isOnline || false}
                      onCheckedChange={(checked) =>
                        onFiltersChange({
                          ...filters,
                          isOnline: checked ? true : undefined,
                        })
                      }
                    />
                    <Label htmlFor="online" className="text-sm">
                      Cuộc thi online
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prize"
                      checked={filters.prizePool || false}
                      onCheckedChange={(checked) =>
                        onFiltersChange({
                          ...filters,
                          prizePool: checked ? true : undefined,
                        })
                      }
                    />
                    <Label htmlFor="prize" className="text-sm">
                      Có giải thưởng
                    </Label>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium mb-2 block"
                  >
                    Địa điểm
                  </Label>
                  <Input
                    id="location"
                    placeholder="Nhập thành phố, tỉnh..."
                    value={filters.location || ""}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        location: e.target.value || undefined,
                      })
                    }
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Quick Filters */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={
                filters.status?.includes("registration-open")
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  status: filters.status?.includes("registration-open")
                    ? filters.status.filter((s) => s !== "registration-open")
                    : ["registration-open"],
                })
              }
            >
              Đang mở đăng ký
            </Button>
            <Button
              variant={filters.isOnline ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  isOnline: filters.isOnline ? undefined : true,
                })
              }
            >
              Online
            </Button>
            <Button
              variant={filters.prizePool ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  prizePool: filters.prizePool ? undefined : true,
                })
              }
            >
              <Trophy className="h-3 w-3 mr-1" />
              Có giải thưởng
            </Button>
          </div>
        </div>

        {/* Sort */}
        <Select defaultValue="relevance">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Liên quan nhất</SelectItem>
            <SelectItem value="deadline">Hạn đăng ký</SelectItem>
            <SelectItem value="start-date">Ngày bắt đầu</SelectItem>
            <SelectItem value="participants">Số người tham gia</SelectItem>
            <SelectItem value="newest">Mới nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Bộ lọc đang áp dụng:
          </span>
          {filters.category?.map((category) => {
            const categoryData = competitionCategories.find(
              (c) => c.name === category,
            );
            return (
              <Badge key={category} variant="secondary" className="gap-1">
                {categoryData?.icon} {categoryData?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleCategoryChange(category, false)}
                />
              </Badge>
            );
          })}
          {filters.level?.map((level) => {
            const levelData = levels.find((l) => l.value === level);
            return (
              <Badge key={level} variant="secondary" className="gap-1">
                {levelData?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleLevelChange(level, false)}
                />
              </Badge>
            );
          })}
          {filters.status?.map((status) => {
            const statusData = statuses.find((s) => s.value === status);
            return (
              <Badge key={status} variant="secondary" className="gap-1">
                {statusData?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleStatusChange(status, false)}
                />
              </Badge>
            );
          })}
          {filters.isOnline && (
            <Badge variant="secondary" className="gap-1">
              Online
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, isOnline: undefined })
                }
              />
            </Badge>
          )}
          {filters.prizePool && (
            <Badge variant="secondary" className="gap-1">
              Có giải thưởng
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, prizePool: undefined })
                }
              />
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              {filters.location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, location: undefined })
                }
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
