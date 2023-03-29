import {
  Button,
  Center,
  Loader,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { Address } from "@prisma/client";
import { IconEdit, IconX } from "@tabler/icons";
import { useState } from "react";
import { saveAddressInstructions } from "../../lib/services/AddressService";

export default function AddressInstructions({
  address,
  title = "Special Instructions",
}: {
  address: Address;
  title?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [instructions, setInstructions] = useState(address.instructions);
  return (
    <Stack mt={"xl"}>
      {saving ? (
        <Text>
          <Center>
            <Loader />
          </Center>
        </Text>
      ) : (
        <>
          <Center>
            <Title order={4}>
              {title}
              {editing ? (
                <Button
                  variant="subtle"
                  onClick={() => setEditing(false)}
                  style={{ marginLeft: "1rem" }}
                >
                  <IconX />
                </Button>
              ) : (
                <Button variant="subtle" onClick={() => setEditing(true)}>
                  <IconEdit />
                </Button>
              )}
            </Title>
          </Center>

          <Center>
            {editing ? (
              <Textarea
                value={instructions ?? ""}
                cols={80}
                autosize
                maxRows={20}
                minRows={2}
                onChange={(e) => setInstructions(e.currentTarget.value)}
                onBlur={async () => {
                  setSaving(true);
                  await saveAddressInstructions(address.id, instructions);
                  setSaving(false);
                  setEditing(false);
                }}
              ></Textarea>
            ) : (
              <Text>{instructions ?? "No special instructions"}</Text>
            )}
          </Center>
        </>
      )}
    </Stack>
  );
}
