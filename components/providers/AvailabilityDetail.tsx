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
  availability: Availability[] | null,
  availabilitySetter: (a: Availability[] | null) => void,
  day: string,
  startTime: string,
  endTime: string
) {
  if (!availability) {
    return;
  }
  const availabilityForDay = availability.find((a) => a.day === day);
  if (availabilityForDay) {
    availabilityForDay.start = startTime;
    availabilityForDay.end = endTime;
  } else {
    availabilitySetter([
      ...availability,
      {
        day: day,
        start: startTime,
        end: endTime,
      } as Availability,
    ]);
  }
}

function generateTimeInput(
  dayAvailability: Availability | undefined,
  availabilitySetter: (a: Availability[] | null) => void,
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
                availabilitySetter,
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
  readonly = false,
}: {
  availability: Availability[];
  readonly?: boolean;
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
    updatedAvailability: Availability[] | null,
    availabilitySetter: (a: Availability[] | null) => void
  ) {
    return (
      <Checkbox
        label="Not Available"
        onChange={(event) => {
          if (event?.target?.checked) {
            setUpdatedAvailability(
              updatedAvailability?.filter((a) => a.day !== day) ?? null
            );
          } else {
            setAvailabilityForDay(
              updatedAvailability,
              availabilitySetter,
              day,
              availability.find((a) => a.day === day)?.start ?? "00:00:00",
              availability.find((a) => a.day === day)?.end ?? "00:00:00"
            );
            console.log(updatedAvailability);
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
          {editing && !readonly ? (
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
            <>
              {!readonly && (
                <Button
                  onClick={() => setEditing(true)}
                  color="blue"
                  variant="subtle"
                >
                  Edit
                </Button>
              )}
            </>
          )}
        </Group>
        {editing && !readonly ? (
          <>
            {JSON.stringify(updatedAvailability)}
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
                      setUpdatedAvailability,
                      "start",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateTimeInput(
                      sundayAvailability,
                      setUpdatedAvailability,
                      "end",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateNotAvailableCheckbox(
                      "sunday",
                      updatedAvailability,
                      setUpdatedAvailability
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Monday</td>
                  <td>
                    {generateTimeInput(
                      mondayAvailability,
                      setUpdatedAvailability,
                      "start",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateTimeInput(
                      mondayAvailability,
                      setUpdatedAvailability,
                      "end",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateNotAvailableCheckbox(
                      "monday",
                      updatedAvailability,
                      setUpdatedAvailability
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>
                    {generateTimeInput(
                      tuesdayAvailability,
                      setUpdatedAvailability,
                      "start",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateTimeInput(
                      tuesdayAvailability,
                      setUpdatedAvailability,
                      "end",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateNotAvailableCheckbox(
                      "tuesday",
                      updatedAvailability,
                      setUpdatedAvailability
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>
                    {generateTimeInput(
                      wednesdayAvailability,
                      setUpdatedAvailability,
                      "start",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateTimeInput(
                      wednesdayAvailability,
                      setUpdatedAvailability,
                      "end",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateNotAvailableCheckbox(
                      "wednesday",
                      updatedAvailability,
                      setUpdatedAvailability
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>
                    {generateTimeInput(
                      thursdayAvailability,
                      setUpdatedAvailability,
                      "start",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateTimeInput(
                      thursdayAvailability,
                      setUpdatedAvailability,
                      "end",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateNotAvailableCheckbox(
                      "thursday",
                      updatedAvailability,
                      setUpdatedAvailability
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>
                    {generateTimeInput(
                      fridayAvailability,
                      setUpdatedAvailability,
                      "start",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateTimeInput(
                      fridayAvailability,
                      setUpdatedAvailability,
                      "end",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateNotAvailableCheckbox(
                      "friday",
                      updatedAvailability,
                      setUpdatedAvailability
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>
                    {generateTimeInput(
                      saturdayAvailability,
                      setUpdatedAvailability,
                      "start",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateTimeInput(
                      saturdayAvailability,
                      setUpdatedAvailability,
                      "end",
                      updatedAvailability
                    )}
                  </td>
                  <td>
                    {generateNotAvailableCheckbox(
                      "saturday",
                      updatedAvailability,
                      setUpdatedAvailability
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </>
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
