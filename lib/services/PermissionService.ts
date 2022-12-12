import { User } from "next-auth";
import { getSession } from "next-auth/react";
import { Roles, RolePermissions, TRole } from "../../data/permissions";

// Get all permissions for a given role
function getRolePermissions(role: TRole): string[] {
    return RolePermissions.filter((rp) => rp.role.name === role.name).map((rp) => rp.permission.name);
}

// Gets role type by name
function getRoleByName(name: string): TRole {
    return Roles.find((r) => r.name === name);
}

// Get a user's role
function getUserRole(user: User): TRole {
    return getRoleByName(user.role);
}

// Checks if current session user can perform a given action by permission
async function sessionUserCan(permission: string): Promise<boolean> {
    try {
        return can(
            getUserRole(
                await getSession().then(s => s.user)
            ),
            permission)
    } catch (e) {
        return false
    }
}

// Checks if a given role can perform a given action by permission
function can(role: TRole, permission: string): boolean {
    return getRolePermissions(
        role
    ).includes(permission);
}

export { can, sessionUserCan, getRoleByName, getRolePermissions };