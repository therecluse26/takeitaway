import { Permission, RoleEnum, RolePermission } from "@prisma/client";
import cuid from "cuid";

const permissionData: Permission[] = [
    {
        id: cuid(),
        name: 'users:permissions',
        description: 'Assign user roles and permissions'
    },
    {
        id: cuid(),
        name: 'users:write',
        description: 'Modify any non-admin user'
    },
    {
        id: cuid(),
        name: 'users:read',
        description: 'View any user'
    },
    {
        id: cuid(),
        name: 'users:read-basic',
        description: "View any user's basic information"
    },
    {
        id: cuid(),
        name: 'users:delete',
        description: 'Delete any user'
    },
    {
        id: cuid(),
        name: 'schedule:read-basic',
        description: 'View basic schedule availability'
    },
    {
        id: cuid(),
        name: 'schedule:read',
        description: 'View full schedule details'
    },
    {
        id: cuid(),
        name: 'schedule:request',
        description: 'Request being added to a service schedule'
    },
    {
        id: cuid(),
        name: 'schedule:write',
        description: 'Change schedules'
    },
    {
        id: cuid(),
        name: 'services:purchase',
        description: 'Purchase a service'
    },
    {
        id: cuid(),
        name: 'services:write',
        description: 'Modify any services'
    },
    {
        id: cuid(),
        name: 'services:read',
        description: 'View any service'
    },
    {
        id: cuid(),
        name: 'services:delete',
        description: 'Delete any service'
    },
];

const rolePermissionData: RolePermission[] = [
    // Subscriber permissions
    permissionData.filter(p =>
        p.name === 'users:read-basic' ||
        p.name === 'services:read' ||
        p.name === 'services:purchase' ||
        p.name === 'schedule:read-basic' ||
        p.name === 'schedule:request'
    ).map((p) => {
        return { id: cuid(), role: RoleEnum.subscriber, permissionId: p.id }
    }),

    // Provider permissions
    permissionData.filter(p =>
        p.name === 'users:read' ||
        p.name === 'services:read' ||
        p.name === 'services:purchase' ||
        p.name === 'schedule:read' ||
        p.name === 'schedule:request'
    ).map((p) => {
        return { id: cuid(), role: RoleEnum.provider, permissionId: p.id }
    }),

    // Admin permissions
    permissionData.filter(p =>
        p.name === 'users:read' ||
        p.name === 'users:write' ||
        p.name === 'services:read' ||
        p.name === 'services:write' ||
        p.name === 'services:purchase' ||
        p.name === 'services:delete' ||
        p.name === 'schedule:read' ||
        p.name === 'schedule:request' ||
        p.name === 'schedule:write'
    ).map((p) => {
        return { id: cuid(), role: RoleEnum.admin, permissionId: p.id }
    }),

    // Superadmin permissions
    permissionData.map((p) => {
        return { id: cuid(), role: RoleEnum.superadmin, permissionId: p.id }
    }),
].flat()

export { permissionData, rolePermissionData }