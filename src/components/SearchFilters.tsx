import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  X,
  CalendarDays,
  MapPin,
  Trophy,
  RotateCcw,
  Tag,
  Target,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CompetitionFilters, CompetitionConstants } from "@/types";
import { COMPETITIONS_CONSTANTS_ENDPOINT } from "@/services/constant/apiConfig";

// Debounce utility function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

interface SearchFiltersProps {
  filters: CompetitionFilters;
  onFiltersChange: (filters: CompetitionFilters) => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
}: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CompetitionFilters>(filters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [constants, setConstants] = useState<CompetitionConstants | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch constants from API
  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const response = await fetch(COMPETITIONS_CONSTANTS_ENDPOINT);
        const data = await response.json();
        if (data.status === "success") {
          setConstants(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch competition constants:", error);
        // Fallback to default constants if API fails
        setConstants({
          categories: {
            "PROGRAMMING": "Lập trình",
            "DESIGN": "Thiết kế",
            "BUSINESS": "Kinh doanh",
            "SCIENCE": "Khoa học",
          },
          levels: {
            "BEGINNER": "Người mới bắt đầu",
            "INTERMEDIATE": "Trung cấp",
            "ADVANCED": "Nâng cao",
            "ALL_LEVELS": "Mọi cấp độ",
          },
          statuses: {
            "REGISTRATION_OPEN": "Đang mở đăng ký",
            "IN_PROGRESS": "Đang diễn ra",
            "COMPLETED": "Đã hoàn thành",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConstants();
  }, []);

  // Sync local filters with parent filters when they change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      const updatedFilters = { ...localFilters, search: searchValue };
      onFiltersChange(updatedFilters);
    }, 500),
    [localFilters, onFiltersChange]
  );

  // Apply filters immediately for non-text inputs
  const applyFilters = (newFilters: Partial<CompetitionFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  // Apply text search with debouncing
  const applyTextSearch = (newFilters: Partial<CompetitionFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    if (newFilters.search !== undefined) {
      debouncedSearch(newFilters.search);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: CompetitionFilters = {
      search: "",
      category: [],
      status: [],
      level: [],
      start_date: "",
      end_date: "",
      location: "",
      isOnline: undefined,
      prizePool: undefined,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Handle checkbox changes for multi-select filters
  const handleMultiSelectChange = (
    field: 'category' | 'status' | 'level',
    value: string,
    checked: boolean
  ) => {
    const currentValues = localFilters[field] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    
    applyFilters({ [field]: newValues });
  };

  // Remove individual filter
  const removeFilter = (field: keyof CompetitionFilters, value?: string) => {
    if (field === 'category' || field === 'status' || field === 'level') {
      const currentValues = localFilters[field] || [];
      const newValues = value ? currentValues.filter(v => v !== value) : [];
      applyFilters({ [field]: newValues });
    } else {
      applyFilters({ [field]: undefined });
    }
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.category?.length) count++;
    if (localFilters.status?.length) count++;
    if (localFilters.level?.length) count++;
    if (localFilters.location) count++;
    if (localFilters.start_date) count++;
    if (localFilters.end_date) count++;
    if (localFilters.isOnline !== undefined) count++;
    if (localFilters.prizePool !== undefined) count++;
    return count;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Đang tải..." disabled className="pl-10" />
          </div>
          <Button disabled>Đang tải...</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary Search and Quick Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cuộc thi theo tên, mô tả, kỹ năng..."
            value={localFilters.search || ""}
            onChange={(e) => applyTextSearch({ search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        {/* Quick Status Filter */}
        <Select
          value={localFilters.status?.includes("REGISTRATION_OPEN") ? "open" : "all"}
          onValueChange={(value) => {
            if (value === "open") {
              applyFilters({ status: ["REGISTRATION_OPEN"] });
            } else {
              applyFilters({ status: [] });
            }
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="open">Đang mở đăng ký</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Bộ lọc nâng cao</span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
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
              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Danh mục cuộc thi</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {constants && Object.entries(constants.categories).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${key}`}
                        checked={localFilters.category?.includes(key) || false}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange('category', key, checked as boolean)
                        }
                      />
                      <Label htmlFor={`category-${key}`} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Levels */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Cấp độ</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {constants && Object.entries(constants.levels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${key}`}
                        checked={localFilters.level?.includes(key) || false}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange('level', key, checked as boolean)
                        }
                      />
                      <Label htmlFor={`level-${key}`} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Status */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Trạng thái cuộc thi</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {constants && Object.entries(constants.statuses).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${key}`}
                        checked={localFilters.status?.includes(key) || false}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange('status', key, checked as boolean)
                        }
                      />
                      <Label htmlFor={`status-${key}`} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Date Range */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Thời gian thi</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Từ ngày</label>
                    <Input
                      type="date"
                      value={localFilters.start_date || ""}
                      onChange={(e) => applyFilters({ start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Đến ngày</label>
                    <Input
                      type="date"
                      value={localFilters.end_date || ""}
                      onChange={(e) => applyFilters({ end_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location and Online */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Địa điểm</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Thành phố/Tỉnh</label>
                    <Input
                      placeholder="Hà Nội, TP. HCM..."
                      value={localFilters.location || ""}
                      onChange={(e) => applyTextSearch({ location: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-4 pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="online"
                        checked={localFilters.isOnline || false}
                        onCheckedChange={(checked) =>
                          applyFilters({ isOnline: checked ? true : undefined })
                        }
                      />
                      <Label htmlFor="online" className="text-sm">
                        Cuộc thi online
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="prize"
                        checked={localFilters.prizePool || false}
                        onCheckedChange={(checked) =>
                          applyFilters({ prizePool: checked ? true : undefined })
                        }
                      />
                      <Label htmlFor="prize" className="text-sm flex items-center">
                        <Trophy className="h-4 w-4 mr-1" />
                        Có giải thưởng
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Bộ lọc đang áp dụng:
          </span>
          
          {/* Category filters */}
          {localFilters.category?.map((category) => (
            <Badge key={`cat-${category}`} variant="secondary" className="gap-1">
              {constants?.categories[category] || category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('category', category)}
              />
            </Badge>
          ))}

          {/* Status filters */}
          {localFilters.status?.map((status) => (
            <Badge key={`status-${status}`} variant="secondary" className="gap-1">
              {constants?.statuses[status] || status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('status', status)}
              />
            </Badge>
          ))}

          {/* Level filters */}
          {localFilters.level?.map((level) => (
            <Badge key={`level-${level}`} variant="secondary" className="gap-1">
              {constants?.levels[level] || level}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('level', level)}
              />
            </Badge>
          ))}

          {/* Date filters */}
          {localFilters.start_date && (
            <Badge variant="secondary" className="gap-1">
              Từ: {localFilters.start_date}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('start_date')}
              />
            </Badge>
          )}
          
          {localFilters.end_date && (
            <Badge variant="secondary" className="gap-1">
              Đến: {localFilters.end_date}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('end_date')}
              />
            </Badge>
          )}

          {/* Other filters */}
          {localFilters.location && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              {localFilters.location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('location')}
              />
            </Badge>
          )}

          {localFilters.isOnline && (
            <Badge variant="secondary" className="gap-1">
              Online
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('isOnline')}
              />
            </Badge>
          )}

          {localFilters.prizePool && (
            <Badge variant="secondary" className="gap-1">
              <Trophy className="h-3 w-3" />
              Có giải thưởng
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('prizePool')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
