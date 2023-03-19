import { Container } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import AddressServiceAssignmentList from '../../components/locations/AddressServiceAssignmentList';
import PageContainer from '../../components/PageContainer';
import getSessionUserProps from '../../lib/props/sessionUser';
import { UserWithRelations } from '../../lib/services/api/ApiUserService';

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getSessionUserProps(context);
};

export default function Pickups(props: { user: UserWithRelations }) {
  return (
    <PageContainer title="Assign Service To Locations">
      <Container>
        <AddressServiceAssignmentList
          addresses={props.user.addresses}
          user={props.user}
          maxPickups={props.user.billingCycle?.pickupsRemaining ?? 0}
        />
      </Container>
    </PageContainer>
  );
}
