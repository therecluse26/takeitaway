import { Button } from "@mantine/core";
import Link from "next/link";
import { uiMessages } from "../../data/messaging";

export function HomeButton(){
    return (
        <Button component={Link} href="/"  variant="subtle" size="md">
            { uiMessages.homeBtnVerbose }
        </Button>
    )
}