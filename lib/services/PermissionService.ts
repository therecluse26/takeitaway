import { User } from "next-auth";
import { getSession } from "next-auth/react";
import { Roles, RolePermissions, TRole } from "../../data/permissions";

// Get all permissions for a given role
function getRolePermissions(role: TRole): string[] {
    return RolePermissions.filter((rp) => rp.role.name === role.name).map((rp) => rp.permission.name);
}

// Gets role type by name
function getRoleByName(name: string): TRole {
    return Roles.find((r) => r.name === name) ?? {name: "Unknown", description: "Unknown"};
}

// Get a user's role
function getUserRole(user: User): TRole {
    return getRoleByName(user.role);
}

// Checks if a given role can perform a given action by permission
function can(role: TRole, permissions: string|string[]): boolean {
    if(typeof permissions === "string"){
        permissions = [permissions];
    }
    const rolePermissions = getRolePermissions(role);
    return permissions.every((p) => {
        return rolePermissions.includes(p);
    });
}

// Checks if current session user can perform a given action by permission
async function sessionUserCan(permission: string): Promise<boolean> {
    try {
        const session = await getSession();
        
        if(!session){
            return false;
        } 

        return can(
            getUserRole(
                session.user
            ),
            permission)
    } catch (e) {
        return false
    }
}

// Checks if user can perform a given action by permission list
function userCan(user: User, permissions: string[]): boolean {    
    if( !can(getUserRole(user), permissions )){
        return false
    }
    return true
}


export { can, getRoleByName, getRolePermissions, userCan }