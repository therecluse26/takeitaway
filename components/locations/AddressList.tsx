import {
  Accordion,
  Badge,
  Button,
  Card,
  Group,
  Title,
  Text,
} from "@mantine/core";
import { Address, AddressType, Provider, User } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ProviderWithRelations } from "../../lib/services/api/ApiProviderService";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";
import AddressForm from "./AddressForm";

const MapPreview = dynamic(
  () =>
    import("../../components/locations/MapPreview").then((mod) => mod.default),
  { ssr: false }
);

const addressIsVisible = (address: Address, visibleAddress: string | null) => {
  return visibleAddress === address.id;
};

export default function AddressList({
  type,
  addresses,
  user = null,
  provider = null,
  title = null,
  showPickups = true,
  mapHeight = "400px",
  mapWidth = "600px",
  mapZoom = 13,
}: {
  type: AddressType;
  addresses: Address[];
  user?: User | UserWithRelations | null;
  provider?: Provider | ProviderWithRelations | null;
  title?: string | null;
  showPickups?: boolean;
  mapHeight?: string;
  mapWidth?: string;
  mapZoom?: number;
}) {
  const [visibleAddress, setVisibleAddress] = useState<string | null>(null);
  const [loadedMaps, setLoadedMaps] = useState<string[]>([]);
  const [displayedAddresses, setDisplayedAddresses] =
    useState<Address[]>(addresses);
  const [addingNewAddress, setAddingNewAddress] = useState(false);

  const addNewAddress = (address: Address): void => {
    setDisplayedAddresses([...displayedAddresses, address]);
    setAddingNewAddress(false);
  };

  return (
    <>
      <Card radius="md">
        {title && <Title order={2}>{title}</Title>}
        {displayedAddresses.length > 0 ? (
          <Accordion
            variant="contained"
            onChange={(addressId: string | null) => {
              if (addressId) {
                setVisibleAddress(addressId);
              }
            }}
          >
            {displayedAddresses.map((address: Address) => (
              <Accordion.Item
                key={address.id}
                value={address.id}
                onClick={() => {
                  // Load Memoized MapPreview to prevent slow initial load
                  setLoadedMaps([
                    ...loadedMaps.filter((v) => v !== address.id),
                    address.id,
                  ]);
                }}
              >
                <Accordion.Control>
                  <Group position="apart">
                    {formatAddress(address)}{" "}
                    {type === "service" && showPickups && <PickupsBadge />}
                    {type === "provider" && (
                      <ServiceRadius radius={provider?.serviceRadius} />
                    )}
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  {loadedMaps.includes(address.id) ? (
                    <MapPreview
                      mapHeight={mapHeight}
                      mapWidth={mapWidth}
                      mapZoom={mapZoom}
                      address={address}
                      visible={addressIsVisible(address, visibleAddress)}
                      serviceRadius={provider?.serviceRadius}
                    />
                  ) : null}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Text>No addresses found</Text>
        )}
      </Card>
      {user ? (
        <>
          <Card p="lg" radius="md">
            {addingNewAddress ? (
              <>
                <AddressForm
                  type="service"
                  user={user}
                  onCanceled={() => {
                    setAddingNewAddress(false);
                  }}
                  onSubmitted={(address: Address) => {
                    addNewAddress(address);
                  }}
                />
              </>
            ) : (
              <Button
                onClick={() => {
                  setAddingNewAddress(true);
                }}
              >
                + Add Location
              </Button>
            )}
          </Card>
        </>
      ) : null}
    </>
  );
}

const PickupsBadge = ({ pickups = 0 }) => {
  const badgeColor = pickups === 0 ? "gray" : "green";
  // Badge that shows the number of pickups the user has at the given location
  return <Badge color={badgeColor}>{pickups} monthly pickups</Badge>;
};

const ServiceRadius = ({ radius = 0 }) => {
  // Badge that shows the service radius of the user at the given location
  return <Badge color="blue">{radius} mile service radius</Badge>;
};

const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
};
