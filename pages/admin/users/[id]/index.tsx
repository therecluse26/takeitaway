import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next/types';
import { JSXElementConstructor } from 'react';
import AddressList from '../../../../components/locations/AddressList';
import PageContainer from '../../../../components/PageContainer';
import {
  getUserWithRelations,
  UserWithRelations,
} from '../../../../lib/services/api/ApiUserService';

const Badge = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Badge as JSXElementConstructor<any>)
);
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
const Text = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Text as JSXElementConstructor<any>)
);

export default function UserDetail(props: { user: UserWithRelations }) {
  const RoleBadge = () => {
    const role =
      props.user.role.charAt(0).toUpperCase() + props.user.role.slice(1);
    return <Badge color="blue">{role}</Badge>;
  };

  return (
    <PageContainer>
      {props.user ? (
        <Container>
          <Group position="center" mt="md" mb="xs">
            <Avatar src={props.user.image} radius={100} size="xl"></Avatar>
            <Space></Space>
            <div>
              <Title>{props.user.name}</Title>
              <Text>{props.user.email}</Text>
            </div>
            <RoleBadge />
          </Group>

          <AddressList
            type="service"
            addresses={props.user.addresses}
            user={props.user}
          />
        </Container>
      ) : (
        <Center>
          <Title order={3}>Failed to load user</Title>
        </Center>
      )}
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context?.params?.id) {
    return {
      notFound: true,
    };
  }

  const user: UserWithRelations | false = await getUserWithRelations(
    context?.params?.id as string
  )
    .then((res) => JSON.parse(JSON.stringify(res)))
    .catch((err) => {
      console.error(err);
      return false;
    });

  if (user === false) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: user,
      authorization: {
        requiresSession: true,
        requiredPermissions: ['admin:dashboard', 'users:read'],
      },
    },
  };
};
