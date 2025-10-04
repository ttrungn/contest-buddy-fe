import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Calendar,
  Search,
  User,
  Menu,
  X,
  Trophy,
  Users,
  Settings,
  BarChart3,
  Briefcase,
  Shield,
  Info,
  Rocket,
  Building2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useBalance } from "@/contexts/BalanceContext";
import { useAppSelector, useAppDispatch } from "@/services/store/store";
import { logout } from "@/services/features/auth/authSlice";
import { isAdmin, isOrganizer, isCustomer, isManager, getPrimaryRole, getRoleDisplayName, getRoleBadgeVariant } from "@/lib/roleUtils";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { balance } = useBalance();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const participantNavigation = [
    { name: "Trang chủ", href: "/home", icon: Rocket },
    { name: "Cuộc thi", href: "/competitions", icon: Trophy },
    { name: "Cộng đồng", href: "/community", icon: Users },
    { name: "About", href: "/about", icon: Info },
  ];

  const organizerNavigation = [
    { name: "Quản lý cuộc thi", href: "/organizer/competitions", icon: Trophy },
    { name: "Báo cáo", href: "/organizer/reports", icon: BarChart3 },
    { name: "Thanh toán", href: "/organizer/billing", icon: Briefcase },
  ];

  // Determine navigation based on user role from auth state
  const userIsAdmin = isAdmin(user);
  const userIsOrganizer = isOrganizer(user);
  const userIsCustomer = isCustomer(user);
  const userIsManager = isManager(user);
  const primaryRole = getPrimaryRole(user);

  // Navigation logic: Admin and Organizer see management navigation, Customer sees participant navigation
  const currentNavigation = isAuthenticated && userIsManager ? organizerNavigation : participantNavigation;

  const isActivePage = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-competition text-competition-foreground">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold gradient-text">Contest Buddy</span>
          {isAuthenticated && primaryRole && (
            <Badge variant={getRoleBadgeVariant(primaryRole)} className="ml-2">
              <Briefcase className="h-3 w-3 mr-1" />
              {getRoleDisplayName(primaryRole)}
            </Badge>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {currentNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActivePage(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Menu & Notifications */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user?.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  {userIsManager ? (
                    <>
                      <div className="px-3 py-2 border-b">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Số dư:</span>
                          <span className="text-sm font-bold text-green-600">{balance.toLocaleString()} VNĐ</span>
                        </div>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link to="/organizer-profile" className="flex items-center">
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>Thông tin Ban tổ chức</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Hồ sơ của tôi</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-competitions" className="flex items-center">
                          <Trophy className="mr-2 h-4 w-4" />
                          <span>Cuộc thi của tôi</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/calendar" className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Lịch thi</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/teams" className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Nhóm</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Đăng nhập</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/login?mode=register" className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Đăng ký</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="w-full py-4 space-y-3 px-4 md:px-6 lg:px-8">
            {/* Mobile Navigation */}
            <nav className="space-y-1">
              {currentNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActivePage(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {/* Additional mobile menu items for customers */}
              {userIsCustomer && (
                <>
                  <Link
                    to="/calendar"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActivePage("/calendar")
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Lịch thi</span>
                  </Link>
                  <Link
                    to="/teams"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActivePage("/teams")
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    <span>Nhóm</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
