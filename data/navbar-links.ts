
import { User } from "next-auth/core/types";
import { userCan } from "../lib/services/PermissionService";

const defaultNavBarLinks: Array<any> = [
    {
        "key": "home",
        "link": "/",
        "label": "Home"
    },
    
    {
        "key": "about",
        "link": "/#about",
        "label": "About"
    },
    {
        "key": "service_area",
        "link": "/#service_area",
        "label": "Service Area"
    },
    {
        "key": "process",
        "link": "/process",
        "label": "Our Process"
    },
    {
        "key": "contact",
        "link": "/#contact",
        "label": "Contact Us"
    },
];

const restrictedLinks = [
    {
        "key": "admin_users",
        "permissions": ["users:read"],
        "link": "/admin/users",
        "label": "Manage Users"
    }
];

function buildNavbarLinks(user?: User) {

    if(!user){
        return defaultNavBarLinks;
    }

    let links = defaultNavBarLinks;

    // Build navbar links that require user permissions
    let permissionLinks = [];

    for(const restrictedLink of restrictedLinks){
        if(userCan(user, restrictedLink.permissions)){
            permissionLinks.push(restrictedLink);
        }
    }

    // Appends allowed permission links to navbar
    if(permissionLinks.length > 0){
        links.push({
            "permissions": ["admin:dashboard"],
            "link": "#",
            "label": "Admin",
            "links": permissionLinks
        })
    }
    
    return links;
}

export {defaultNavBarLinks, buildNavbarLinks};