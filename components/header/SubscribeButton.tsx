import { Button, MediaQuery } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import Link from "next/link";
import { uiMessages } from "../../data/messaging";

export default function SubscribeButton() {
  return (
    <MediaQuery smallerThan="md" styles={{ display: "none" }}>
      <Button
        component={Link}
        href="/products"
        leftIcon={<IconTrash />}
        color="green"
        size="sm"
      >
        {uiMessages.subscribeNowBtn}
      </Button>
    </MediaQuery>
  );
}
