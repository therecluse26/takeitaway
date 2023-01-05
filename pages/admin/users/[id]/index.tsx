import { Accordion } from '@mantine/core';
import { Address } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { GetStaticPaths } from 'next/types';
import { JSXElementConstructor, useState } from 'react';
import { USEQUERY_STALETIME } from '../../../../data/configuration';
import { getUser } from '../../../../lib/services/UserService';

const MapPreview = dynamic(
  () =>
    import('../../../../components/locations/MapPreview').then(
      (mod) => mod.default
    ),
  { ssr: false }
);
const Badge = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Badge as JSXElementConstructor<any>)
);
const Card = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Card as JSXElementConstructor<any>)
);
const Center = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);
const Group = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Group as JSXElementConstructor<any>)
);
const Loader = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Loader as JSXElementConstructor<any>
  )
);
const Space = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Space as JSXElementConstructor<any>)
);
const Avatar = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Avatar as JSXElementConstructor<any>
  )
);
const Container = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Container as JSXElementConstructor<any>
  )
);
const Title = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Title as JSXElementConstructor<any>)
);
const Text = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Text as JSXElementConstructor<any>)
);

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [loadedMaps, setLoadedMaps] = useState<string[]>([]);
  const { data: user, error } = useQuery(
    [`/api/users/${id}`],
    () => getUser(id as string),
    { refetchOnWindowFocus: false, staleTime: USEQUERY_STALETIME }
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

  const RoleBadge = () => {
    const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    return <Badge color="blue">{role}</Badge>;
  };

  const PickupsBadge = ({ pickups = 0 }) => {
    const badgeColor = pickups === 0 ? 'gray' : 'green';
    // Badge that shows the number of pickups the user has at the given location
    return <Badge color={badgeColor}>{pickups} monthly pickups</Badge>;
  };

  return (
    <div>
      <Container>
        <Group position="center" mt="md" mb="xs">
          <Avatar src={user.image} radius={100} size="xl"></Avatar>
          <Space></Space>
          <div>
            <Title>{user.name}</Title>
            <Text>{user.email}</Text>
          </div>
          <RoleBadge />
        </Group>

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
                  <Accordion.Control>
                    <Group position="apart">
                      {formatAddress(address)} <PickupsBadge />
                    </Group>
                  </Accordion.Control>
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
      </Container>
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
