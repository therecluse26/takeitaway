import { Center, Checkbox, Flex, Group } from "@mantine/core";
import { Weekday } from "@prisma/client";
import { useState } from "react";

const monthWeeks = [
  { label: "1st week of the month", value: 1 },
  { label: "2nd week of the month", value: 2 },
  { label: "3rd week of the month", value: 3 },
  { label: "4th week of the month", value: 4 },
];

const weekdays = [
  { label: "Monday", value: Weekday.monday },
  { label: "Tuesday", value: Weekday.tuesday },
  { label: "Wednesday", value: Weekday.wednesday },
  { label: "Thursday", value: Weekday.thursday },
  { label: "Friday", value: Weekday.friday },
  { label: "Saturday", value: Weekday.saturday },
  { label: "Sunday", value: Weekday.sunday },
];

export function WeekdayPicker({
  addressId,
  showWeekNumber = true,
  weekNumber = 1,
  disabledWeekdays = [],
  onChange,
  pickupsRemaining = 0,
}: {
  addressId: string;
  showWeekNumber?: boolean;
  weekNumber?: number;
disabledWeekdays?: Weekday[];
  onChange?: (addressId: string, weekNumber: number, value: Weekday[]) => void;
  pickupsRemaining?: number;
}) {
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  return (
    <Flex>
      <Checkbox.Group
        defaultValue={[]}
        value={selectedWeekdays}
        onChange={(value) => {
          setSelectedWeekdays(value);
          onChange && onChange(addressId, weekNumber, value as Weekday[]);
        }}
        label={showWeekNumber && monthWeeks[weekNumber - 1].label}
      >
        <Group mt="xs">
          {weekdays.map((weekday) => (
            <Checkbox
              key={weekday.label}
              value={weekday.value}
              label={weekday.label}
              disabled={
                disabledWeekdays.includes(weekday.value) ||
                (pickupsRemaining < 1 &&
                  !selectedWeekdays.includes(weekday.value))
              }
            />
          ))}
        </Group>
      </Checkbox.Group>{" "}
    </Flex>
  );
}

export function MonthWeekdayPicker({
  addressId,
  center = false,
  onChange,
  pickupsRemaining = 0,
}: {
  addressId: string;
  center?: boolean;
  onChange?: (addressId: string, weekNumber: number, value: Weekday[]) => void;
  pickupsRemaining?: number;
}) {
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  return (
    <>
      {monthWeeks.map((monthWeek) => (
        <>
          {center ? (
            <Center>
              <WeekdayPicker
                addressId={addressId}
                onChange={onChange}
                key={monthWeek.label}
                weekNumber={monthWeek.value}
                pickupsRemaining={pickupsRemaining}
              />
            </Center>
          ) : (
            <WeekdayPicker
              addressId={addressId}
              onChange={onChange}
              key={monthWeek.label}
              weekNumber={monthWeek.value}
              pickupsRemaining={pickupsRemaining}
            />
          )}
        </>
      ))}
    </>
  );
}
