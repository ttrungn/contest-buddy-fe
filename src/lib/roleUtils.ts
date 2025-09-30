import { User, UserRole } from "@/interfaces/IAuth";

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, "admin");
};

/**
 * Check if user is organizer
 */
export const isOrganizer = (user: User | null): boolean => {
  return hasRole(user, "organizer");
};

/**
 * Check if user is customer (participant)
 */
export const isCustomer = (user: User | null): boolean => {
  return hasRole(user, "customer");
};

/**
 * Check if user is admin or organizer (has management privileges)
 */
export const isManager = (user: User | null): boolean => {
  return isAdmin(user) || isOrganizer(user);
};

/**
 * Get user's primary role (prioritized order: admin > organizer > customer)
 */
export const getPrimaryRole = (user: User | null): UserRole | null => {
  if (!user || !user.roles || user.roles.length === 0) return null;

  if (user.roles.includes("admin")) return "admin";
  if (user.roles.includes("organizer")) return "organizer";
  if (user.roles.includes("customer")) return "customer";

  return null;
};

/**
 * Get role display name in Vietnamese
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: "Quản trị viên",
    organizer: "Ban tổ chức",
    customer: "Thí sinh",
  };
  return roleNames[role];
};

/**
 * Get role badge color variant
 */
export const getRoleBadgeVariant = (
  role: UserRole,
): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<
    UserRole,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    admin: "destructive",
    organizer: "default",
    customer: "secondary",
  };
  return variants[role];
};
