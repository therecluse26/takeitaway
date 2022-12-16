import { useSession } from "next-auth/react";
import { ReactElement } from "react";
import { userCan } from "../lib/services/PermissionService";
import NotAuthorizedPage from "../pages/403";

export default function GuardContent({children, authorization} : {children: ReactElement<any>, authorization: any })
{
    const { status, data: session } : {status: String, data: any } = useSession({ required: false })
    const user = session?.user;
    
    if((status === "unauthenticated" || !user) && authorization?.requiresSession){
        return <NotAuthorizedPage />
    }

    if(status === "authenticated" && authorization?.requiredPermissions && !userCan(user, authorization?.requiredPermissions)){
        return <NotAuthorizedPage />
    }
    
    return children;
}
