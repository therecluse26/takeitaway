/**
 * Types and enums for permissions
 */

type TPermission = {
    name: string;
    description: string;
}

type TRolePermission = {
    role: TRole;
    permission: TPermission;
}

type TRole = {
    name: string;
    description: string;
}

const Roles: TRole[] = [
    { name: 'subscriber', description: "Subscriber" },
    { name: 'provider', description: "Provider" },
    { name: 'admin', description: "Admin" },
    { name: 'superadmin', description: "Superadmin" }
]

const Permissions: TPermission[] = [
    {
        name: 'admin:dashboard',
        description: 'View/Interact with admin dashboard'
    },
    {
        name: 'app:config',
        description: 'Configure application settings'
    },
    {
        name: 'users:permissions',
        description: 'Assign user roles and permissions'
    },
    {
        name: 'users:write',
        description: 'Modify any non-admin user'
    },
    {
        name: 'users:read',
        description: 'View any user'
    },
    {
        name: 'users:read-basic',
        description: "View any user's basic information"
    },
    {
        name: 'users:delete',
        description: 'Delete any user'
    },
    {
        name: 'schedule:read-basic',
        description: 'View basic schedule availability'
    },
    {
        name: 'schedule:read',
        description: 'View full schedule details'
    },
    {
        name: 'schedule:request',
        description: 'Request being added to a service schedule'
    },
    {
        name: 'schedule:write',
        description: 'Change schedules'
    },
    {
        name: 'services:purchase',
        description: 'Purchase a service'
    },
    {
        name: 'services:write',
        description: 'Modify any services'
    },
    {
        name: 'services:read',
        description: 'View any service'
    },
    {
        name: 'services:delete',
        description: 'Delete any service'
    },
];


const RolePermissions: TRolePermission[] = [
    // Subscriber
    Permissions.filter(p =>
        p.name === 'users:read-basic' ||
        p.name === 'services:read' ||
        p.name === 'services:purchase' ||
        p.name === 'schedule:read-basic' ||
        p.name === 'schedule:request')
        .map((p) => { return { role: Roles[0], permission: p } }).flat(),

    // Provider
    Permissions.filter(p =>
        p.name === 'users:read' ||
        p.name === 'services:read' ||
        p.name === 'services:purchase' ||
        p.name === 'schedule:read' ||
        p.name === 'schedule:request')
        .map((p) => { return { role: Roles[1], permission: p } }).flat(),

    // Admin
    Permissions.filter(p =>
        p.name === 'admin:dashboard' ||
        p.name === 'users:read' ||
        p.name === 'users:write' ||
        p.name === 'services:read' ||
        p.name === 'services:write' ||
        p.name === 'services:purchase' ||
        p.name === 'services:delete' ||
        p.name === 'schedule:read' ||
        p.name === 'schedule:request' ||
        p.name === 'schedule:write'
    )
        .map((p) => { return { role: Roles[2], permission: p } }).flat(),

    // Superadmin
    Permissions.map((p) => { return { role: Roles[3], permission: p } }).flat()
].flat()

export { Permissions, RolePermissions, Roles };
export type { TPermission, TRole, TRolePermission };
