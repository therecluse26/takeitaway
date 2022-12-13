import { User } from "next-auth";
import { userCan } from "../lib/services/PermissionService";

const defaultNavBarLinks = [
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

let restrictedLinks = [
    {
        "permission": "users:read",
        "link": "/admin/users",
        "label": "Users"
    }
];

function buildNavbarLinks(user?: User) {
    
    let links = defaultNavBarLinks;

    if(!user){
        return links;
    }

    // Build navbar links that require user permissions
    let permissionLinks = [];

    for( let i = 0; i < restrictedLinks.length; i++ ){

        if(userCan(user, restrictedLinks[i].permission)){

            permissionLinks.push(restrictedLinks[i]);
        }
    }

    // Appends allowed permission links to navbar
    if(permissionLinks.length > 0){
        links.push({
            "link": "#",
            "label": "Admin",
            "links": permissionLinks
        })
    }
    
    return links;
}

export {defaultNavBarLinks, buildNavbarLinks};