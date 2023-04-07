
import { User } from "next-auth/core/types";
import { Roles, RolePermissions } from "../../data/permissions";

// Get all permissions for a given role
function getRolePermissions(role: string): string[] {
    return RolePermissions.get(role) ?? [];
}

// Gets role type by name
function getRoleByName(name: string): string | undefined {
    return Roles.get(name)?.key;
}

// Get a user's role
function getUserRole(user: User): string | undefined {
    return getRoleByName(user.role);
}

// Checks if a given role can perform a given action by permission
function can(role: string | undefined, permissions: string|string[]): boolean {
    if(!role){
        return false;
    }
    if(typeof permissions === "string"){
        permissions = [permissions];
    }
    const rolePermissions = getRolePermissions(role);
    return permissions.every((p) => {
        return rolePermissions.includes(p);
    });
}


// Checks if user can perform a given action by permission list
function userCan(user: User|null|undefined, permissions: string|string[], userId: string|null = null): boolean {

    if(!user){
        return false;
    }

    // User is self
    if(userId && user.id === userId){
        return true;
    }

    if( !can(getUserRole(user), permissions )){
        return false
    }
    return true
}

function userIsSelf(user: User|null|undefined, userId: string): boolean {
    if(!user){
        return false;
    }
    return user.id === userId;
}

function resourceBelongsToUser(resource: any, user: User|null|undefined): boolean {
    if(!user){
        return false;
    }
    if(!resource.userId) {
        return false;
    }
    return resource.userId === user.id;
}

export { can, getRoleByName, getRolePermissions, userCan, resourceBelongsToUser, userIsSelf }