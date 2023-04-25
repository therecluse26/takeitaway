import { Center, Stack, Text, Title } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { formatAddress } from "../../lib/services/AddressService";
import { ProviderWithAddress } from "../../lib/services/api/ApiProviderService";
import { ServiceScheduleItemWithAddress } from "../../lib/services/api/ApiScheduleService";
import DraggableScheduledService from "./DraggableScheduledService";

interface ServiceScheduleItemsProps {
  data: ServiceScheduleItemWithAddress[];
  provider: ProviderWithAddress | null;
}

export function ServiceScheduleItems({
  data,
  provider,
}: ServiceScheduleItemsProps) {
  const [state, handlers] = useListState(data);

  return (
    <Stack>
      {state.length > 0 ? (
        <>
          <Stack>
            <Center mt="lg">
              <Title order={4}>Start</Title>
            </Center>
            <Center>
              <Text>
                {provider && <>{"(" + formatAddress(provider.address) + ")"}</>}
              </Text>
            </Center>
          </Stack>

          <DragDropContext
            onDragEnd={({ destination, source }) => {
              handlers.reorder({
                from: source.index,
                to: destination?.index ?? 0,
              });
            }}
          >
            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {state.length > 0
                    ? state?.map((item, index) => (
                        <DraggableScheduledService
                          key={"draggable_" + item.scheduleId}
                          item={item}
                          index={index}
                        />
                      ))
                    : null}

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
