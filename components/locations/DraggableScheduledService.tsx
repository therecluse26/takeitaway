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
  IconCheck,
  IconCheckbox,
  IconExternalLink,
  IconGripVertical,
  IconUser,
} from "@tabler/icons";
import axios from "axios";
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

  completedItem: {
    backgroundColor: theme.colors.green[0],
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

export default function DraggableScheduledService({
  item,
  index,
}: {
  item: ServiceScheduleRouteWithAddress;
  index: number;
}) {
  const { classes, cx } = useStyles();
  const [scheduledService, setScheduledService] = useState(item);
  const [completing, setCompleting] = useState(false);
  const [completedNotes, setCompletedNotes] = useState<string | null>(null);

  async function logServiceCompletion(
    service: ServiceScheduleRouteWithAddress,
    notes: string
  ) {
    const updatedRouteData = await axios.post("/api/service-logs/create", {
      id: service.id,
      notes,
    });
    setScheduledService(updatedRouteData.data);
  }

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
      <Draggable
        key={scheduledService.id}
        index={index}
        draggableId={scheduledService.id}
      >
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
                              href={`geo:${scheduledService.address.latitude},${scheduledService.address.longitude}`}
                              target={"_blank"}
                            >
                              {formatAddress(scheduledService.address)}{" "}
                              <IconExternalLink size="1rem" />
                            </Text>
                          </Text>
                          {scheduledService.address?.instructions && (
                            <Text color="dimmed" size="sm">
                              {scheduledService.address.instructions}
                            </Text>
                          )}
                        </Stack>
                      </Group>
                    </Grid.Col>

                    <Grid.Col sm={5} span={12}>
                      <Stack>
                        <Button
                          variant="light"
                          component={Link}
                          target="_blank"
                          href={`/admin/users/${scheduledService.user.id}`}
                        >
                          <Group>
                            <IconUser size="1.5rem" />{" "}
                            {scheduledService.user.name}
                          </Group>
                        </Button>
                        {scheduledService.completed ? (
                          <Button variant="subtle" color={"green"} disabled>
                            <Group>
                              <IconCheck />
                              <Text>Completed</Text>
                            </Group>
                          </Button>
                        ) : (
                          <Button
                            variant="light"
                            color={"green"}
                            onClick={() => {
                              setCompleting(true);
                            }}
                          >
                            <Group>
                              <IconCheckbox size="1.5rem" />
                              <Text>Mark Complete</Text>
                            </Group>
                          </Button>
                        )}
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
