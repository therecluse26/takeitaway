import { Button, Loader } from '@mantine/core';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next/types';
import { JSXElementConstructor, useEffect, useState } from 'react';
import AddressList from '../../../../components/locations/AddressList';
import PageContainer from '../../../../components/PageContainer';
import AvailabilityDetail from '../../../../components/providers/AvailabilityDetail';
import {
  getProviderWithRelations,
  ProviderWithRelations,
} from '../../../../lib/services/api/ApiProviderService';
import { Availability } from '../../../../types/provider';

const Center = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);
const Group = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Group as JSXElementConstructor<any>)
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

const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

export default function ProviderDetail(props: {
  provider: ProviderWithRelations;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isBrowser()) {
      setLoading(false);
    }
  }, []);

  return (
    <PageContainer>
      {loading ? (
        <Loader />
      ) : (
        <>
          {props.provider ? (
            <Container size="xl">
              <Group position="center" mt="md" mb="xs">
                <Avatar
                  src={props.provider.user.image}
                  radius={100}
                  size="xl"
                ></Avatar>
                <Space></Space>
                <div>
                  <Title>{props.provider.user.name}</Title>
                </div>
              </Group>

              <Group>
                <Title order={4}>Service Address</Title>
                <Button variant="subtle" color="blue">
                  Edit
                </Button>
              </Group>
              <AddressList
                mapHeight="500px"
                mapWidth="100%"
                mapZoom={9}
                type="provider"
                addresses={[props.provider.address]}
                provider={props.provider}
              />
            </Container>
          ) : (
            <Center>
              <Title order={3}>Failed to load user</Title>
            </Center>
          )}
        </>
      )}
      <AvailabilityDetail
        availability={props.provider.availability as Availability[]}
        provider={props.provider}
      />
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context?.params?.id) {
    return {
      notFound: true,
    };
  }

  const provider: ProviderWithRelations | false =
    await getProviderWithRelations(context?.params?.id as string)
      .then((res) => JSON.parse(JSON.stringify(res)))
      .catch((err) => {
        console.error(err);
        return false;
      });

  if (!provider) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      provider: provider,
      authorization: {
        requiresSession: true,
        requiredPermissions: ['admin:dashboard', 'providers:read'],
      },
    },
  };
};
