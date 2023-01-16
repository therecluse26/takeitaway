// Permissions API

import { getRoleByName, getRolePermissions } from "../../../lib/services/PermissionService";


export async function roleByName(name: string): Promise<string|undefined> {
    return getRoleByName(name);
}

export async function rolePermissions(role: string): Promise<string[]> {
    return getRolePermissions(
        getRoleByName(role) ?? "unknown"
    );
}

