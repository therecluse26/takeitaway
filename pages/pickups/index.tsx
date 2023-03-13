import { Container } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import AddressList from '../../components/locations/AddressList';
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
    <PageContainer title="Assign Pickups To Locations">
      <Container>
        <AddressList
          mapHeight="500px"
          mapWidth="100%"
          mapZoom={12}
          type="service"
          addresses={props.user.addresses}
          user={props.user}
        />
      </Container>
    </PageContainer>
  );
}
