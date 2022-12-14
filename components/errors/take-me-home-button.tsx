import { uiMessages } from "../../data/messaging";

import dynamic from "next/dynamic";
const Button = dynamic(() => import('@mantine/core').then((mod) => mod.Button))
const Link = dynamic(() => import('next/link'))

export function HomeButton(){
    return (
        <Button component={Link} href="/"  variant="subtle" size="md">
            { uiMessages.homeBtnVerbose }
        </Button>
    )
}