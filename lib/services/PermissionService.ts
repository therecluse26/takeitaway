import { Roles, RolePermissions, TRole } from "../data/permissions";

// Get all permissions for a given role
function getRolePermissions(role: TRole): string[] {
    return RolePermissions.filter((rp) => rp.role.name === role.name).map((rp) => rp.permission.name);
}

function getRoleByName(name: string): TRole {
    return Roles.find((r) => r.name === name);
}

export { getRoleByName, getRolePermissions };