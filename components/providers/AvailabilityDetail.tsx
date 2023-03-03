import { Container, Stack, Table, Title } from "@mantine/core";
import {
  convertUtcTimeToLocalTime,
  localTimeZone,
} from "../../lib/services/ProviderService";
import { Availability } from "../../types/provider";

export default function AvailabilityDetail({
  availability,
}: {
  availability: Availability[];
}) {
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
      : "Off";
  };

  return (
    <Container size="md">
      <Stack>
        <Title order={4}>Availability ({localTimeZone}) </Title>
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
      </Stack>
    </Container>
  );
}
