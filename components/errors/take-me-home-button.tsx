import { uiMessages } from "../../data/messaging";

import dynamic from "next/dynamic";
import { JSXElementConstructor } from "react";
const Button = dynamic(() => import('@mantine/core').then((mod) => mod.Button as JSXElementConstructor<any>))
const Link = dynamic(() => import('next/link'))

export function HomeButton(){
    return (
        <Button text="Return Home" component={Link} href="/"  variant="subtle" size="md">
            { uiMessages.homeBtnVerbose ?? "Return Home"}
        </Button>
    )
}