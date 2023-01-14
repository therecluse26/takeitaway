
import { User } from "next-auth/core/types";
import { userCan } from "../lib/services/PermissionService";

const defaultNavBarLinks: Array<any> = [
    {
        "key": "test",
        "link": "/test",
        "label": "Test"
    },
    {
        "key": "learn",
        "link": "#",
        "label": "Learn",
        "links": [
            {
                "key": "test1",
                "link": "/test",
                "label": "Test"
            },
        ]
    },
    {
        "key": "about",
        "link": "/about",
        "label": "About"
    },
    {
        "key": "pricing",
        "link": "/pricing",
        "label": "Pricing"
    },
    {
        "key": "support",
        "link": "#",
        "label": "Support",
        "links": [
            {
                "key": "faq",
                "link": "/faq",
                "label": "FAQ"
            },
            {
                "key": "demo",
                "link": "/demo",
                "label": "Book a demo"
            },
            {
                "key": "forums",
                "link": "/forums",
                "label": "Forums"
            }
        ]
    }
];

const restrictedLinks = [
    {
        "key": "admin_users",
        "permissions": ["users:read"],
        "link": "/admin/users",
        "label": "Users"
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
            "link": "/admin",
            "label": "Admin",
            "links": permissionLinks
        })
    }
    
    return links;
}

export {defaultNavBarLinks, buildNavbarLinks};