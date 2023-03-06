import {
  Button,
  Checkbox,
  Container,
  Group,
  Stack,
  Table,
  Title,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons";
import { useState } from "react";
import {
  convertUtcTimeToLocalTime,
  localTimeZone,
} from "../../lib/services/ProviderService";
import { Availability } from "../../types/provider";

function setAvailabilityForDay(
  availability: Availability[],
  day: string,
  startTime: string,
  endTime: string
) {
  const availabilityForDay = availability.find((a) => a.day === day);
  if (availabilityForDay) {
    availabilityForDay.start = startTime;
    availabilityForDay.end = endTime;
  } else {
    availability.push({
      day: day,
      start: startTime,
      end: endTime,
    } as Availability);
  }
}

function generateTimeInput(
  dayAvailability: Availability | undefined,
  startOrEnd: "start" | "end",
  updatedAvailability: Availability[] | null
) {
  return (
    <>
      {dayAvailability && (
        <TimeInput
          format="12"
          defaultValue={
            dayAvailability
              ? new Date(
                  "1970-01-01T" + dayAvailability[startOrEnd] + ":00.000Z"
                )
              : undefined
          }
          onChange={(value) => {
            if (value) {
              setAvailabilityForDay(
                updatedAvailability ?? [],
                "sunday",
                value.toTimeString(),
                dayAvailability[startOrEnd] ?? ""
              );
            }
          }}
          icon={<IconClock size="1rem" stroke={1.5} />}
        />
      )}
    </>
  );
}

export default function AvailabilityDetail({
  availability,
}: {
  availability: Availability[];
}) {
  const [editing, setEditing] = useState(false);

  const [updatedAvailability, setUpdatedAvailability] = useState<
    Availability[] | null
  >(availability);

  const sundayAvailability = availability.find((a) => a.day === "sunday");
  const mondayAvailability = availability.find((a) => a.day === "monday");
  const tuesdayAvailability = availability.find((a) => a.day === "tuesday");
  const wednesdayAvailability = availability.find((a) => a.day === "wednesday");
  const thursdayAvailability = availability.find((a) => a.day === "thursday");
  const fridayAvailability = availability.find((a) => a.day === "friday");
  const saturdayAvailability = availability.find((a) => a.day === "saturday");

  const formatAvailability = (availability?: Availability | null) => {
    return availability
      ? convertUtcTimeToLocalTime(availability.start) +
          " - " +
          convertUtcTimeToLocalTime(availability.end)
      : "Not Available";
  };

  function generateNotAvailableCheckbox(
    day: string,
    updatedAvailability: Availability[] | null
  ) {
    return (
      <Checkbox
        label="Not Available"
        onChange={(checked) => {
          if (checked) {
            setUpdatedAvailability(
              updatedAvailability?.filter((a) => a.day !== day) ?? null
            );
          }
        }}
      />
    );
  }

  return (
    <Container size="xl">
      <Stack>
        <Group>
          <Title order={4}>Availability ({localTimeZone}) </Title>
          {editing ? (
            <>
              {" "}
              <Button
                onClick={() => setEditing(false)}
                color="red"
                variant="subtle"
              >
                Cancel
              </Button>{" "}
              <Button
                onClick={() => setEditing(false)}
                color="green"
                variant="subtle"
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              color="blue"
              variant="subtle"
            >
              Edit
            </Button>
          )}
        </Group>
        {editing ? (
          <Table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sunday</td>
                <td>
                  {generateTimeInput(
                    sundayAvailability,
                    "start",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateTimeInput(
                    sundayAvailability,
                    "end",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateNotAvailableCheckbox("sunday", updatedAvailability)}
                </td>
              </tr>
              <tr>
                <td>Monday</td>
                <td>
                  {generateTimeInput(
                    mondayAvailability,
                    "start",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateTimeInput(
                    mondayAvailability,
                    "end",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateNotAvailableCheckbox("monday", updatedAvailability)}
                </td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>
                  {generateTimeInput(
                    tuesdayAvailability,
                    "start",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateTimeInput(
                    tuesdayAvailability,
                    "end",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateNotAvailableCheckbox("tuesday", updatedAvailability)}
                </td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>
                  {generateTimeInput(
                    wednesdayAvailability,
                    "start",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateTimeInput(
                    wednesdayAvailability,
                    "end",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateNotAvailableCheckbox(
                    "wednesday",
                    updatedAvailability
                  )}
                </td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>
                  {generateTimeInput(
                    thursdayAvailability,
                    "start",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateTimeInput(
                    thursdayAvailability,
                    "end",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateNotAvailableCheckbox(
                    "thursday",
                    updatedAvailability
                  )}
                </td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>
                  {generateTimeInput(
                    fridayAvailability,
                    "start",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateTimeInput(
                    fridayAvailability,
                    "end",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateNotAvailableCheckbox("friday", updatedAvailability)}
                </td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>
                  {generateTimeInput(
                    saturdayAvailability,
                    "start",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateTimeInput(
                    saturdayAvailability,
                    "end",
                    updatedAvailability
                  )}
                </td>
                <td>
                  {generateNotAvailableCheckbox(
                    "saturday",
                    updatedAvailability
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <Table withBorder withColumnBorders>
            <thead>
              <tr>
                <th>Sunday</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatAvailability(sundayAvailability)}</td>
                <td>{formatAvailability(mondayAvailability)}</td>
                <td>{formatAvailability(tuesdayAvailability)}</td>
                <td>{formatAvailability(wednesdayAvailability)}</td>
                <td>{formatAvailability(thursdayAvailability)}</td>
                <td>{formatAvailability(fridayAvailability)}</td>
                <td>{formatAvailability(saturdayAvailability)}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </Stack>
    </Container>
  );
}
