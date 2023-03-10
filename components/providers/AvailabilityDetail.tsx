import {
  Button,
  Checkbox,
  Container,
  Group,
  Stack,
  Table,
  Title,
} from "@mantine/core";
import { TimeRangeInput } from "@mantine/dates";
import { Provider } from "@prisma/client";
import { IconClock } from "@tabler/icons";
import { useState } from "react";
import {
  convertUtcTimeToLocalTime,
  localTimeZone,
  updateAvailability,
} from "../../lib/services/ProviderService";
import { Availability } from "../../types/provider";

const formatAvailability = (availability?: Availability | null) => {
  return availability
    ? convertUtcTimeToLocalTime(availability.start) +
        " - " +
        convertUtcTimeToLocalTime(availability.end)
    : "Not Available";
};

function formatDateRange(
  availability?: Availability | null
): [Date | null, Date | null] | undefined {
  return availability
    ? [
        new Date("1970-01-01T" + availability.start + ":00.000Z") ?? null,
        new Date("1970-01-01T" + availability.end + ":00.000Z") ?? null,
      ]
    : undefined;
}

export default function AvailabilityDetail({
  availability,
  provider,
  readonly = false,
}: {
  availability: Availability[];
  provider: Provider;
  readonly?: boolean;
}) {
  const [editing, setEditing] = useState(false);

  const [updatedAvailability, setUpdatedAvailability] = useState<
    Availability[] | null
  >(availability);

  const sundayAvailability =
    updatedAvailability?.find((a) => a.day === "sunday") ?? null;
  const mondayAvailability =
    updatedAvailability?.find((a) => a.day === "monday") ?? null;
  const tuesdayAvailability =
    updatedAvailability?.find((a) => a.day === "tuesday") ?? null;
  const wednesdayAvailability =
    updatedAvailability?.find((a) => a.day === "wednesday") ?? null;
  const thursdayAvailability =
    updatedAvailability?.find((a) => a.day === "thursday") ?? null;
  const fridayAvailability =
    updatedAvailability?.find((a) => a.day === "friday") ?? null;
  const saturdayAvailability =
    updatedAvailability?.find((a) => a.day === "saturday") ?? null;

  function setAvailabilityForDay(
    availability: Availability[] | null,
    weekday: string,
    startTime: string,
    endTime: string
  ) {
    if (!availability) {
      return;
    }
    let availabilityClone = [...availability];
    let availabilityForDay = availability.find((a) => a.day === weekday);
    // get the index of the availability for the day
    if (availabilityForDay) {
      const index = availability.findIndex((a) => a.day === weekday);
      availabilityForDay.start = startTime;
      availabilityForDay.end = endTime;
      availabilityClone[index] = availabilityForDay;
    } else {
      availabilityForDay = {
        day: weekday,
        start: startTime,
        end: endTime,
      } as Availability;
      availabilityClone.push(availabilityForDay);
    }
    setUpdatedAvailability(availabilityClone);
  }

  const NotAvailableCheckbox = ({
    weekday,
    checked = false,
    updatedAvailability,
  }: {
    weekday: string;
    checked: boolean;
    updatedAvailability: Availability[] | null;
  }) => {
    return (
      <Checkbox
        label="Not Available"
        checked={checked}
        onChange={(event) => {
          if (event?.target?.checked) {
            setUpdatedAvailability(
              updatedAvailability?.filter((a) => a.day !== weekday) ?? null
            );
          } else {
            setAvailabilityForDay(
              updatedAvailability,
              weekday,
              availability.find((a) => a.day === weekday)?.start ?? "00:00:00",
              availability.find((a) => a.day === weekday)?.end ?? "00:00:00"
            );
          }
        }}
      />
    );
  };

  return (
    <Container size="xl">
      <Stack>
        <Group>
          <Title order={4}>Weekly Availability ({localTimeZone}) </Title>
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
                onClick={() => {
                  updateAvailability(provider?.id, updatedAvailability);
                }}
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
                  <th>Availability</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sunday</td>

                  <td>
                    <TimeRangeInput
                      format={"12"}
                      disabled={sundayAvailability ? false : true}
                      defaultValue={
                        sundayAvailability
                          ? formatDateRange(sundayAvailability)
                          : undefined
                      }
                      onChange={(value) => {
                        if (value) {
                          setAvailabilityForDay(
                            updatedAvailability ?? [],
                            "sunday",
                            value[0]?.toTimeString().substring(0, 5),
                            value[1]?.toTimeString().substring(0, 5)
                          );
                          return value;
                        }
                      }}
                      icon={<IconClock size="1rem" stroke={1.5} />}
                    />
                  </td>
                  <td>
                    <NotAvailableCheckbox
                      checked={sundayAvailability ? false : true}
                      weekday="sunday"
                      updatedAvailability={updatedAvailability ?? null}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Monday</td>
                  <td>
                    <TimeRangeInput
                      format={"12"}
                      disabled={mondayAvailability ? false : true}
                      defaultValue={
                        mondayAvailability
                          ? formatDateRange(mondayAvailability)
                          : undefined
                      }
                      onChange={(value) => {
                        if (value) {
                          setAvailabilityForDay(
                            updatedAvailability ?? [],
                            "monday",
                            value[0]?.toTimeString().substring(0, 5),
                            value[1]?.toTimeString().substring(0, 5)
                          );
                          return value;
                        }
                      }}
                      icon={<IconClock size="1rem" stroke={1.5} />}
                    />
                  </td>
                  <td>
                    <NotAvailableCheckbox
                      checked={mondayAvailability ? false : true}
                      weekday="monday"
                      updatedAvailability={updatedAvailability ?? null}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>
                    <TimeRangeInput
                      format={"12"}
                      disabled={tuesdayAvailability ? false : true}
                      defaultValue={
                        tuesdayAvailability
                          ? formatDateRange(tuesdayAvailability)
                          : undefined
                      }
                      onChange={(value) => {
                        if (value) {
                          setAvailabilityForDay(
                            updatedAvailability ?? [],
                            "tuesday",
                            value[0]?.toTimeString().substring(0, 5),
                            value[1]?.toTimeString().substring(0, 5)
                          );
                          return value;
                        }
                      }}
                      icon={<IconClock size="1rem" stroke={1.5} />}
                    />
                  </td>
                  <td>
                    <NotAvailableCheckbox
                      checked={tuesdayAvailability ? false : true}
                      weekday="tuesday"
                      updatedAvailability={updatedAvailability ?? null}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>
                    <TimeRangeInput
                      format={"12"}
                      disabled={wednesdayAvailability ? false : true}
                      defaultValue={
                        wednesdayAvailability
                          ? formatDateRange(wednesdayAvailability)
                          : undefined
                      }
                      onChange={(value) => {
                        if (value) {
                          setAvailabilityForDay(
                            updatedAvailability ?? [],
                            "wednesday",
                            value[0]?.toTimeString().substring(0, 5),
                            value[1]?.toTimeString().substring(0, 5)
                          );
                          return value;
                        }
                      }}
                      icon={<IconClock size="1rem" stroke={1.5} />}
                    />
                  </td>
                  <td>
                    <NotAvailableCheckbox
                      checked={wednesdayAvailability ? false : true}
                      weekday="wednesday"
                      updatedAvailability={updatedAvailability ?? null}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>
                    <TimeRangeInput
                      format={"12"}
                      disabled={thursdayAvailability ? false : true}
                      defaultValue={
                        thursdayAvailability
                          ? formatDateRange(thursdayAvailability)
                          : undefined
                      }
                      onChange={(value) => {
                        if (value) {
                          setAvailabilityForDay(
                            updatedAvailability ?? [],
                            "thursday",
                            value[0]?.toTimeString().substring(0, 5),
                            value[1]?.toTimeString().substring(0, 5)
                          );
                          return value;
                        }
                      }}
                      icon={<IconClock size="1rem" stroke={1.5} />}
                    />
                  </td>
                  <td>
                    <NotAvailableCheckbox
                      checked={thursdayAvailability ? false : true}
                      weekday="thursday"
                      updatedAvailability={updatedAvailability ?? null}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>
                    <TimeRangeInput
                      format={"12"}
                      disabled={fridayAvailability ? false : true}
                      defaultValue={
                        fridayAvailability
                          ? formatDateRange(fridayAvailability)
                          : undefined
                      }
                      onChange={(value) => {
                        if (value) {
                          setAvailabilityForDay(
                            updatedAvailability ?? [],
                            "friday",
                            value[0]?.toTimeString().substring(0, 5),
                            value[1]?.toTimeString().substring(0, 5)
                          );
                          return value;
                        }
                      }}
                      icon={<IconClock size="1rem" stroke={1.5} />}
                    />
                  </td>
                  <td>
                    <NotAvailableCheckbox
                      checked={fridayAvailability ? false : true}
                      weekday="friday"
                      updatedAvailability={updatedAvailability ?? null}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>
                    <TimeRangeInput
                      format={"12"}
                      disabled={saturdayAvailability ? false : true}
                      defaultValue={
                        saturdayAvailability
                          ? formatDateRange(saturdayAvailability)
                          : undefined
                      }
                      onChange={(value) => {
                        if (value) {
                          setAvailabilityForDay(
                            updatedAvailability ?? [],
                            "saturday",
                            value[0]?.toTimeString().substring(0, 5),
                            value[1]?.toTimeString().substring(0, 5)
                          );
                          return value;
                        }
                      }}
                      icon={<IconClock size="1rem" stroke={1.5} />}
                    />
                  </td>
                  <td>
                    <NotAvailableCheckbox
                      checked={saturdayAvailability ? false : true}
                      weekday="saturday"
                      updatedAvailability={updatedAvailability ?? null}
                    />
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
