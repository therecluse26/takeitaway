import {
  Button,
  Center,
  createStyles,
  Flex,
  Grid,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconCheck,
  IconCheckbox,
  IconChevronDown,
  IconGripVertical,
} from "@tabler/icons";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { formatAddress } from "../../lib/services/AddressService";
import { ServiceScheduleRouteWithAddress } from "../../lib/services/api/ApiScheduleService";
import DraggableScheduledService from "./DraggableScheduledService";

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

interface ServiceScheduleRoutesProps {
  data: ServiceScheduleRouteWithAddress[];
}

export function ServiceScheduleRoutes({ data }: ServiceScheduleRoutesProps) {
  const { classes } = useStyles();
  const [state, handlers] = useListState(data);

  const items =
    state.length > 0
      ? state?.map((item, index) => (
          <>
            <DraggableScheduledService item={item} index={index} />
            <Center mb="sm" mt="xs">
              <IconChevronDown size="1.5rem" className={classes.chevron} />
            </Center>
          </>
        ))
      : null;

  return (
    <Stack>
      {state.length > 0 ? (
        <>
          <Center mt="lg">
            <Title order={4}>Start</Title>
          </Center>

          <DragDropContext
            onDragEnd={({ destination, source }) =>
              handlers.reorder({
                from: source.index,
                to: destination?.index || 0,
              })
            }
          >
            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {items}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Center mt={"-20px"}>
            <Title order={4}>End</Title>
          </Center>
        </>
      ) : (
        <Center mt="lg">
          <Text size={"lg"}>No scheduled pickups for this date</Text>
        </Center>
      )}
    </Stack>
  );
}
