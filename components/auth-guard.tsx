import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useSession } from "next-auth/react";
import NotAuthorizedPage from "../pages/403";


const GuardContent = ({children, authorization}): ReactJSXElement => {
    const { status, data: session } = useSession({ required: false })
    const user = session?.user;
    
    if((status === "unauthenticated" || !user) && authorization?.requiresSession){
        return <NotAuthorizedPage />
    }

    if(status === "authenticated" && authorization?.requiredPermissions){

    }
    
    return children;
};

export { GuardContent }