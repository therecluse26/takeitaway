import {
  Text,
  Title,
  Center,
  TitleOrder,
  Stack,
  Container,
  Accordion,
  Grid,
  Group,
  Button,
} from "@mantine/core";
import { Address, Provider, User, Weekday } from "@prisma/client";
import { useState } from "react";
import { formatAddress } from "../../lib/services/AddressService";
import { ProviderWithRelations } from "../../lib/services/api/ApiProviderService";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";
import { setUserPickupPreferences } from "../../lib/services/UserService";
import { PickupPreference } from "../../types/schedule";
import { MonthWeekdayPicker } from "../scheduling/WeekdayPicker";
import { PickupsBadge, ServiceRangeBadge } from "./AddressList";

function getTitleSize(size: string): TitleOrder {
  switch (size) {
    case "xs":
      return 5;
    case "sm":
      return 4;
    case "md":
      return 3;
    case "lg":
      return 2;
    case "xl":
      return 1;
    default:
      return 3;
  }
}

export default function AddressServiceAssignmentList({
  addresses,
  user,
  provider,
  title,
  titleSize = "md",
  maxPickups = 0,
  showPickupCount = true,
  initialPickupPreferences = [],
}: {
  addresses: Address[];
  user?: User | UserWithRelations | null;
  provider?: Provider | ProviderWithRelations | null;
  title?: string;
  titleSize?: "xs" | "sm" | "md" | "lg" | "xl";
  maxPickups?: number;
  showPickupCount?: boolean;
  initialPickupPreferences?: PickupPreference[];
}) {
  const [pickupsRemaining, setPickupsRemaining] = useState(maxPickups);
  const [pickups, setPickups] = useState<PickupPreference[]>(
    initialPickupPreferences
  );

  function updatePickups(
    addressId: string,
    weekNumber: number,
    weekdays: Weekday[]
  ) {
    const newPickups = pickups.filter(
      (pickup) =>
        pickup.addressId !== addressId || pickup.weekNumber !== weekNumber
    );

    newPickups.push(
      ...weekdays.map((weekday) => ({
        addressId,
        weekNumber,
        weekday,
      }))
    );

    setPickups(newPickups);
    setPickupsRemaining(maxPickups - newPickups.length);
  }

  function updateUserPickupPreferences() {
    if (user) {
      setUserPickupPreferences(user, pickups);
    }
  }

  function addressesInServiceArea(): Address[] {
    return addresses.filter((address) => {
      return address.inServiceArea === true;
    });
  }

  return (
    <>
      {title && (
        <Center>
          <Title order={getTitleSize(titleSize)}>{title}</Title>
        </Center>
      )}

      <Container mt="lg">
        <Center>
          <Stack mb="lg">
            <Text size="lg">
              {addressesInServiceArea().length} Locations in Service Area
            </Text>
            {showPickupCount && (
              <Text size="lg">{pickupsRemaining} Pickups Remaining</Text>
            )}
            <Button onClick={updateUserPickupPreferences}>Save</Button>
          </Stack>
        </Center>
        <Accordion variant="contained">
          {addressesInServiceArea().map((address) => (
            <Accordion.Item key={address.id} value={address.id}>
              <Accordion.Control>
                <Grid>
                  <Grid.Col span={6}>{formatAddress(address)}</Grid.Col>
                  <Grid.Col span={6}>
                    <Group position="right">
                      <ServiceRangeBadge withinRange={address.inServiceArea} />
                      <PickupsBadge />
                    </Group>
                  </Grid.Col>
                </Grid>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <Center>
                    <Title order={4}>Preferred Monthly Pickup Days</Title>{" "}
                  </Center>

                  {/* <WeekdayPicker /> */}
                  <MonthWeekdayPicker
                    addressId={address.id}
                    onChange={updatePickups}
                    pickupsRemaining={pickupsRemaining}
                    center
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </>
  );
}
