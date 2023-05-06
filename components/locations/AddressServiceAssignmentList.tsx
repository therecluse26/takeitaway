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
  Loader,
} from "@mantine/core";
import { Address, User, Weekday } from "@prisma/client";
import { useEffect, useState } from "react";
import { formatAddress } from "../../lib/services/AddressService";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";
import { setUserPickupPreferences } from "../../lib/services/UserService";
import { PickupPreference } from "../../types/schedule";
import { MonthWeekdayPicker } from "../scheduling/WeekdayPicker";
import AddressInstructions from "./AddressInstructions";
import { PickupsBadge, ServiceRangeBadge } from "./AddressList";
const Hash = require("object-hash");

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
  title,
  titleSize = "md",
  maxPickups = 0,
  showPickupCount = true,
  initialPickupPreferences = [],
}: {
  addresses: Address[];
  user?: User | UserWithRelations | null;
  title?: string;
  titleSize?: "xs" | "sm" | "md" | "lg" | "xl";
  maxPickups?: number;
  showPickupCount?: boolean;
  initialPickupPreferences?: PickupPreference[];
}) {
  const [loading, setLoading] = useState(false);
  const [initialHash, setInitialHash] = useState(
    Hash.MD5(initialPickupPreferences)
  );
  const [stateHash, setStateHash] = useState(initialHash);
  const [loadedAddresses, setLoadedAddresses] = useState<Address[]>(addresses);
  const [pickupsRemaining, setPickupsRemaining] = useState(maxPickups);
  const [pickups, setPickups] = useState<PickupPreference[]>(
    initialPickupPreferences
  );

  function choosePickups(
    addressId: string,
    weekNumber: number,
    weekdays: Weekday[]
  ) {
    const newPickups = pickups.filter(
      (pickup) =>
        pickup.addressId !== addressId || pickup.weekNumber !== weekNumber
    );
    newPickups.push(
      ...weekdays
        .filter((weekday) => {
          return weekday !== undefined && weekday !== null;
        })
        .map((weekday) => ({
          addressId,
          weekNumber,
          weekday,
        }))
    );

    setPickups(newPickups);
    setStateHash(Hash.MD5(newPickups));
  }

  useEffect(() => {
    setPickupsRemaining(maxPickups - pickups.length);
  }, [maxPickups, pickups]);

  async function updateUserPickupPreferences() {
    if (user) {
      setLoading(true);
      const updatedUser = await (
        await setUserPickupPreferences(user, pickups)
      )?.data;

      setLoadedAddresses(updatedUser?.addresses ?? []);
      setInitialHash(Hash.MD5(pickups));
      setStateHash(Hash.MD5(pickups));
      setLoading(false);
    }
  }

  function addressesInServiceArea(): Address[] {
    return loadedAddresses.filter((address) => {
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
            {loading ? (
              <Center>
                <Loader size="md" />
              </Center>
            ) : (
              <Button
                onClick={updateUserPickupPreferences}
                disabled={initialHash === stateHash}
              >
                Save
              </Button>
            )}
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
                      <PickupsBadge pickups={address.pickupsAllocated} />
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
                    onChange={choosePickups}
                    pickupsRemaining={pickupsRemaining}
                    initialPickupPreferences={initialPickupPreferences}
                    center
                  />

                  <AddressInstructions address={address} />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </>
  );
}
