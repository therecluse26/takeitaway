import {
  Card,
  Text,
  Title,
  Center,
  TitleOrder,
  Stack,
  Container,
} from "@mantine/core";
import { Address, AddressType, Provider, User } from "@prisma/client";
import { useState } from "react";
import { formatAddress } from "../../lib/services/AddressService";
import { ProviderWithRelations } from "../../lib/services/api/ApiProviderService";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";

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
}: {
  addresses: Address[];
  user?: User | UserWithRelations | null;
  provider?: Provider | ProviderWithRelations | null;
  title?: string;
  titleSize?: "xs" | "sm" | "md" | "lg" | "xl";
  maxPickups?: number;
  showPickupCount?: boolean;
}) {
  const [pickupsRemaining, setPickupsRemaining] = useState(maxPickups);

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
        <Stack spacing="sm">
          {addressesInServiceArea().map((address) => (
            <Card key={address.id} radius="md" withBorder mb="sm">
              {formatAddress(address)}
            </Card>
          ))}
        </Stack>
      </Container>
    </>
  );
}
