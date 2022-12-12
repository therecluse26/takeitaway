import { TRole } from "../../../data/permissions";
import { getRoleByName, getRolePermissions } from "../../../lib/services/PermissionService";


export function roleByName(name: string): TRole {
    return getRoleByName(name);
}

export function rolePermissions(role: string): string[] {
    return getRolePermissions(
        getRoleByName(role)
    );
}

