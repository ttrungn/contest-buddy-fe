import { Badge } from "@/components/ui/badge";
import { User } from "@/interfaces/IAuth";
import { getRoleDisplayName, getRoleBadgeVariant, getPrimaryRole } from "@/lib/roleUtils";

interface RoleIndicatorProps {
    user: User | null;
    showAllRoles?: boolean;
}

export default function RoleIndicator({ user, showAllRoles = false }: RoleIndicatorProps) {
    if (!user || !user.roles || user.roles.length === 0) {
        return null;
    }

    const primaryRole = getPrimaryRole(user);

    if (!showAllRoles && primaryRole) {
        // Show only primary role
        return (
            <Badge variant={getRoleBadgeVariant(primaryRole)} className="ml-2">
                {getRoleDisplayName(primaryRole)}
            </Badge>
        );
    }

    // Show all roles
    return (
        <div className="flex flex-wrap gap-1 ml-2">
            {user.roles.map((role) => (
                <Badge key={role} variant={getRoleBadgeVariant(role)}>
                    {getRoleDisplayName(role)}
                </Badge>
            ))}
        </div>
    );
}
