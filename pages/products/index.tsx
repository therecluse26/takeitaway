import { Container } from '@mantine/core';
import { Service } from '@prisma/client';
import PageContainer from '../../components/PageContainer';
import ServiceListSingle from '../../components/services/ServiceListSingle';
import { getDisplayedServices } from '../../lib/services/api/ApiServiceService';

export default function ProductIndex(props: { services: Service[] }) {
  return (
    <PageContainer highlightedTitle="Subscriptions">
      <Container size={'lg'}>
        {props.services.map((service) => (
          <ServiceListSingle key={service.id} service={service} />
        ))}
      </Container>
    </PageContainer>
  );
}

export async function getServerSideProps() {
  const services: Service[] = await getDisplayedServices().then((res) =>
    JSON.parse(JSON.stringify(res))
  );

  return {
    props: { services: services },
  };
}
