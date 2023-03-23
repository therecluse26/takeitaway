import { Container } from '@mantine/core';
import { PickupPreference } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import AddressServiceAssignmentList from '../../components/locations/AddressServiceAssignmentList';
import PageContainer from '../../components/PageContainer';
import getSessionUserProps from '../../lib/props/sessionUser';
import {
  getUserPickupPreferences,
  getUserWithRelations,
  UserWithRelations,
} from '../../lib/services/api/ApiUserService';
import { getSessionUser } from '../../lib/services/UserService';
import { authOptions } from '../api/auth/[...nextauth]';

export default function Pickups(props: {
  user: UserWithRelations;
  pickupPreferences: PickupPreference[];
}) {
  return (
    <PageContainer title="Assign Service To Locations">
      <Container>
        <AddressServiceAssignmentList
          addresses={props.user.addresses}
          user={props.user}
          initialPickupPreferences={props.pickupPreferences}
          maxPickups={props.user.billingCycle?.pickups ?? 0}
        />
      </Container>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  const user: UserWithRelations | false = await getUserWithRelations(
    session?.user?.id as string
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

  const pickupPreferences: PickupPreference[] = await getUserPickupPreferences(
    user.id
  );

  return {
    props: {
      user: user,
      pickupPreferences: pickupPreferences,
      authorization: {
        requiresSession: true,
      },
    },
  };
};
