import { Center, Checkbox, Flex, Group } from "@mantine/core";
import { Weekday } from "@prisma/client";
import { memo, useState } from "react";
import { PickupPreference } from "../../types/schedule";
import { PickupPreference as PrismaPickupPreference } from "@prisma/client";

type AnyPickupPreference = PickupPreference | PrismaPickupPreference;

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

const WeekdayPicker = ({
  addressId,
  showWeekNumber = true,
  weekNumber = 1,
  disabledWeekdays = [],
  onChange,
  pickupsRemaining = 0,
  initialPickupPreferences = [],
}: {
  addressId: string;
  showWeekNumber?: boolean;
  weekNumber?: number;
  disabledWeekdays?: Weekday[];
  // eslint-disable-next-line unused-imports/no-unused-vars
  onChange?: (addressId: string, weekNumber: number, value: Weekday[]) => void;
  pickupsRemaining?: number;
  initialPickupPreferences?: AnyPickupPreference[];
}) => {
  const [selectedWeekdays, setSelectedWeekdays] = useState<
    (string | undefined | any)[]
  >(
    initialPickupPreferences.map((preference) => {
      if (
        addressId === preference.addressId &&
        preference.weekNumber === weekNumber
      ) {
        return preference.weekday as string;
      }
    })
  );

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
              checked={selectedWeekdays.includes(weekday.value)}
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
};

export function MonthWeekdayPicker({
  addressId,
  center = false,
  onChange,
  pickupsRemaining = 0,
  initialPickupPreferences = [],
}: {
  addressId: string;
  center?: boolean;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onChange?: (addressId: string, weekNumber: number, value: Weekday[]) => void;
  pickupsRemaining?: number;
  initialPickupPreferences?: AnyPickupPreference[];
}) {
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
                initialPickupPreferences={initialPickupPreferences}
                pickupsRemaining={pickupsRemaining}
              />
            </Center>
          ) : (
            <WeekdayPicker
              addressId={addressId}
              onChange={onChange}
              key={monthWeek.label}
              weekNumber={monthWeek.value}
              initialPickupPreferences={initialPickupPreferences}
              pickupsRemaining={pickupsRemaining}
            />
          )}
        </>
      ))}
    </>
  );
}

export default memo(WeekdayPicker);
