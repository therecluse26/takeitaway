// Permissions API

import { TRole } from "../../../data/permissions";
import { getRoleByName, getRolePermissions } from "../../../lib/services/PermissionService";


export async function roleByName(name: string): Promise<TRole> {
    return getRoleByName(name);
}

export async function rolePermissions(role: string): Promise<string[]> {
    return getRolePermissions(
        getRoleByName(role)
    );
}

