import { Button, Container, Stack, Title } from '@mantine/core';
import { Address } from '@prisma/client';
import dynamic from 'next/dynamic';
import { JSXElementConstructor, useState } from 'react';
import PaymentMethodsList from '../../components/billing/PaymentMethodsList';
import AddressList from '../../components/locations/AddressList';
import PageContainer from '../../components/PageContainer';
import { UserWithRelations } from '../../lib/services/api/ApiUserService';
import { GetServerSidePropsContext } from 'next/types';
import BillingAddress from '../../components/billing/BillingAddress';
import getSessionUserProps from '../../lib/props/sessionUser';

const Center = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);

const Text = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Text as JSXElementConstructor<any>)
);

export default function Account(props: { user: UserWithRelations }) {
  const [billingaddress, setBillingAddress] = useState<Address | null>(
    props.user.billingAddress
  );

  return (
    <PageContainer title="Account">
      <Center mb={'2rem'}>
        <Stack spacing={0}>
          <Text>
            {props.user.name} <Button variant="subtle">Edit</Button>{' '}
          </Text>
          <Text>{props.user.email}</Text>
        </Stack>
      </Center>

      <Container size="xl" mb={'2rem'}>
        <PaymentMethodsList user={props.user} />
      </Container>

      <Container mb={'2rem'}>
        <BillingAddress
          user={props.user}
          billingaddress={billingaddress}
          setBillingAddress={setBillingAddress}
        />
      </Container>

      <Container>
        <Title id="service-addresses" order={4}>
          Service Addresses
        </Title>
        <AddressList
          user={props.user}
          addresses={props.user.addresses}
          type={'service'}
        />
      </Container>
    </PageContainer>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getSessionUserProps(context);
};
