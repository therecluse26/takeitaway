
import { User } from "next-auth/core/types";
import { userCan } from "../lib/services/PermissionService";

const defaultNavBarLinks: Array<any> = [
    {
        "link": "/test",
        "label": "Test"
    },
    {
        "link": "#",
        "label": "Learn",
        "links": [
            {
                "link": "/test",
                "label": "Test"
            },
        ]
    },
    {
        "link": "/about",
        "label": "About"
    },
    {
        "link": "/pricing",
        "label": "Pricing"
    },
    {
        "link": "#",
        "label": "Support",
        "links": [
            {
                "link": "/faq",
                "label": "FAQ"
            },
            {
                "link": "/demo",
                "label": "Book a demo"
            },
            {
                "link": "/forums",
                "label": "Forums"
            }
        ]
    }
];

const restrictedLinks = [
    {
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