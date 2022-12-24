import {
  Accordion,
  Badge,
  Card,
  Center,
  Group,
  Loader,
  Space,
} from '@mantine/core';
import { Address } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { GetStaticPaths } from 'next/types';
import { useState } from 'react';
import configuration from '../../../../data/configuration';
import { getUser } from '../../../../lib/services/UserService';

const MapPreview = dynamic(
  () =>
    import('../../../../components/locations/MapPreview').then(
      (mod) => mod.default
    ),
  { ssr: false }
);

export default function UserDetail() {
  const router = useRouter();
  const [loadedMaps, setLoadedMaps] = useState<string[]>([]);
  const { id } = router.query;
  const { data: user, error } = useQuery(
    [`/api/users/${id}`],
    () => getUser(id as string),
    { refetchOnWindowFocus: false, staleTime: configuration.cacheStaleTime }
  );

  if (error) return <div>failed to load</div>;
  if (!user)
    return (
      <Center>
        <Loader />
      </Center>
    );

  const formatAddress = (address: Address): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  };

  const SubscriptionBadge =
    user.subscriptions?.length > 0
      ? () => (
          <Badge color="green">
            {user.subscriptions.length} Active Subscription
            {user.subscriptions.length > 1 ? 's' : null}
          </Badge>
        )
      : () => <Badge color="red">No Active Subscription</Badge>;

  return (
    <div>
      <Card radius="md">
        <Group position="apart" mt="md" mb="xs">
          <div>
            <h1>{user.name}</h1>
            <div>{user.email}</div>
          </div>

          <SubscriptionBadge />
        </Group>
      </Card>
      <Space h="lg" />

      {user.addresses?.length > 0 ? (
        <Card radius="md">
          <h2>Locations</h2>
          <Accordion variant="contained">
            {user.addresses.map((address: Address) => (
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
                <Accordion.Control>{formatAddress(address)}</Accordion.Control>
                <Accordion.Panel>
                  {loadedMaps.includes(address.id) ? (
                    <MapPreview address={address} />
                  ) : null}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card>
      ) : (
        <Card p="lg" radius="md">
          + Add Location
        </Card>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export async function getStaticProps() {
  return {
    props: {
      authorization: {
        requiresSession: true,
        requiredPermissions: ['admin:dashboard', 'users:read'],
      },
    },
  };
}
