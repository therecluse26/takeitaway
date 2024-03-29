/**
 * Types and enums for permissions
 */

type KeyLabelShape = {
    key: string,
    label: string
}

type TPermission = Map<string, KeyLabelShape>;

type TRolePermission =  Map<string, string>;

type TRole = Map<string, KeyLabelShape>

const Roles: TRole = new Map([
    ['subscriber', {key: 'subscriber', label: "Subscriber"}],
    ['provider', {key: 'provider', label: "Provider"}],
    ['admin', {key: 'admin', label: "Admin"}],
    ['superadmin', {key: 'superadmin', label: "Superadmin"}]
]);

const Permissions: TPermission = new Map([
    ['admin:dashboard', {key: 'admin:dashboard', label: 'View/Interact with admin dashboard'}],
    ['admin:config', {key: 'admin:config', label: 'Configure application settings'}],
    ['users:permissions', {key: 'users:permissions', label: 'Assign user roles and permissions'}],
    ['users:write', {key: 'users:write', label: 'Modify any non-admin user'}],
    ['users:read', {key: 'users:read', label: 'View any user'}],
    ['users:read-basic', {key: 'users:read-basic', label: "View any user's basic information"}],
    ['users:delete', {key: 'users:delete', label: 'Delete any user'}],
    ['providers:read', {key: 'providers:read', label: 'View providers'}],
    ['providers:read-basic', {key: 'providers:read-basic', label: "View providers' basic information"}],
    ['providers:write', {key: 'providers:write', label: 'Modify providers'}],
    ['providers:delete', {key: 'providers:delete', label: 'Delete providers'}],
    ['schedule:read-basic', {key: 'schedule:read-basic', label: 'View basic schedule availability'}],
    ['schedule:read', {key: 'schedule:read', label: 'View full schedule details'}],
    ['schedule:request', {key: 'schedule:request', label: 'Request being added to a service schedule'}],
    ['schedule:write', {key: 'schedule:write', label: 'Change schedules'}],
    ['schedule:delete', {key: 'schedule:delete', label: 'Delete schedules'}],
    ['schedule:approve', {key: 'schedule:approve', label: 'Approve schedule requests'}],
    ['schedule:deny', {key: 'schedule:deny', label: 'Deny schedule requests'}],
    ['schedule:assign', {key: 'schedule:assign', label: 'Assign schedules to providers'}],
    ['schedule:unassign', {key: 'schedule:unassign', label: 'Unassign schedules from providers'}],
    ['schedule:assign-self', {key: 'schedule:assign-self', label: 'Assign schedules to self'}],
    ['schedule:unassign-self', {key: 'schedule:unassign-self', label: 'Unassign schedules from self'}],
    ['schedule:assign-other', {key: 'schedule:assign-other', label: 'Assign schedules to other providers'}],
    ['schedule:unassign-other', {key: 'schedule:unassign-other', label: 'Unassign schedules from other providers'}],
    ['services:purchase', {key: 'services:purchase', label: 'Purchase a service'}],
    ['services:read', {key: 'services:read', label: 'View services'}],
    ['services:write', {key: 'services:write', label: 'Create/Modify services'}],
    ['services:delete', {key: 'services:delete', label: 'Delete services'}],
    ['services:assign', {key: 'services:assign', label: 'Assign services to providers'}],
    ['services:unassign', {key: 'services:unassign', label: 'Unassign services from providers'}],
    ['services:assign-self', {key: 'services:assign-self', label: 'Assign services to self'}],
    ['services:unassign-self', {key: 'services:unassign-self', label: 'Unassign services from self'}],
    ['services:assign-other', {key: 'services:assign-other', label: 'Assign services to other providers'}],
    ['services:unassign-other', {key: 'services:unassign-other', label: 'Unassign services from other providers'}],
    ['service-logs:read', {key: 'service-logs:read', label: 'View service logs'}],
    ['service-logs:write', {key: 'service-logs:write', label: 'Create/Modify service logs'}],
    ['service-logs:delete', {key: 'service-logs:delete', label: 'Delete service logs'}],
]);

const RolePermissions: Map<string, string[]> = new Map([
    ['subscriber', [
        'users:read-basic', 
        'services:read', 
        'services:purchase', 
        'schedule:read-basic', 
        'schedule:request'
    ]],
    ['provider', 
        ['providers:read-basic',
        'users:read-basic',
        'services:read',
        'services:purchase',
        'schedule:read-basic',
        'schedule:read',
        'schedule:request',
        'service-logs:read',
        'service-logs:write',
    ]
    ],
    ['admin', [
        'admin:dashboard',
        'providers:read-basic',
        'providers:read',
        'providers:write',
        'providers:delete',
        'users:read',
        'users:write',
        'services:read',
        'services:write',
        'services:purchase',
        'services:delete',
        'schedule:read',
        'schedule:write',
        'schedule:request',
        'service-logs:read',
        'service-logs:write',
    ]],

    ['superadmin', 
       Array.from(Permissions.keys())
    ]
]);

export { Permissions, RolePermissions, Roles };
export type { TPermission, TRole, TRolePermission, KeyLabelShape };
