import {
  Button,
  createStyles,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import {
  IconAppWindow,
  IconCheckbox,
  IconDeviceMobile,
  IconExternalLink,
  IconGripVertical,
  IconShare,
  IconUser,
  IconWindow,
} from "@tabler/icons";
import Link from "next/link";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { formatAddress } from "../../lib/services/AddressService";
import { ServiceScheduleRouteWithAddress } from "../../lib/services/api/ApiScheduleService";

const useStyles = createStyles((theme) => ({
  item: {
    alignItems: "center",
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,

    border: `2px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `12px 6px`,
    paddingLeft: `calc(${theme.spacing.xl} - ${theme.spacing.md})`, // to offset drag handle
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  chevron: {
    color: theme.colors.gray[5],
  },

  itemDragging: {
    boxShadow: theme.shadows.md,
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
}));

async function logServiceCompletion(
  service: ServiceScheduleRouteWithAddress,
  notes: string
) {
  alert("Log service completion for " + service.id + " with notes: " + notes);
}

export default function DraggableScheduledService({
  item,
  index,
}: {
  item: ServiceScheduleRouteWithAddress;
  index: number;
}) {
  const { classes, cx } = useStyles();
  const [completing, setCompleting] = useState(false);
  const [completedNotes, setCompletedNotes] = useState<string | null>(null);

  return (
    <>
      <Modal
        centered
        opened={completing}
        onClose={() => {
          setCompleting(false);
        }}
        title="Log Service Completion"
      >
        <Stack>
          <Text>Notes (optional)</Text>
          <Textarea
            value={completedNotes ?? ""}
            onInput={(e) => {
              setCompletedNotes(e.currentTarget.value);
            }}
          ></Textarea>
          <Button
            onClick={async () => {
              await logServiceCompletion(item, completedNotes as string);
              setCompleting(false);
              setCompletedNotes(null);
            }}
          >
            Done
          </Button>
        </Stack>
      </Modal>
      <Draggable key={item.id} index={index} draggableId={item.id}>
        {(provided, snapshot) => (
          <>
            <div
              className={cx(classes.item, {
                [classes.itemDragging]: snapshot.isDragging,
              })}
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <Grid>
                <Grid.Col span={2}>
                  <div
                    {...provided.dragHandleProps}
                    className={classes.dragHandle}
                  >
                    <IconGripVertical size="1.05rem" stroke={1.5} />
                  </div>
                </Grid.Col>
                <Grid.Col span={10}>
                  <Grid align={"center"}>
                    <Grid.Col sm={7} span={12}>
                      <Group spacing={"xl"}>
                        <Stack>
                          <Text size="sm">
                            <Text
                              color="blue"
                              component={"a"}
                              href={`geo:${item.address.latitude},${item.address.longitude}`}
                              target={"_blank"}
                            >
                              {formatAddress(item.address)}{" "}
                              <IconExternalLink size="1rem" />
                            </Text>
                          </Text>
                          {item.address?.instructions && (
                            <Text color="dimmed" size="sm">
                              {item.address.instructions}
                            </Text>
                          )}
                        </Stack>
                      </Group>
                    </Grid.Col>

                    <Grid.Col sm={5} span={12}>
                      <Stack>
                        <Button
                          variant="subtle"
                          component={Link}
                          target="_blank"
                          href={`/admin/users/${item.user.id}`}
                        >
                          <Group>
                            <IconUser size="1.5rem" /> {item.user.name}
                          </Group>
                        </Button>

                        <Button
                          variant="subtle"
                          color={"green"}
                          onClick={() => {
                            setCompleting(true);
                          }}
                        >
                          <Group>
                            <IconCheckbox size="1.5rem" />
                            <Text>Complete</Text>
                          </Group>
                        </Button>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
            </div>
          </>
        )}
      </Draggable>
    </>
  );
}
