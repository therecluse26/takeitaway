import { Button, Center, Container, Loader } from '@mantine/core';
import { Address } from '@prisma/client';
import { IconArrowRight } from '@tabler/icons';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import BillingAddress from '../../components/billing/BillingAddress';
import PaymentMethodsList from '../../components/billing/PaymentMethodsList';
import AddressList from '../../components/locations/AddressList';
import PageContainer from '../../components/PageContainer';
import getSessionUserProps from '../../lib/props/sessionUser';
import { UserWithRelations } from '../../lib/services/api/ApiUserService';
import { getCartItems } from '../../lib/services/CheckoutService';
import { redirectToCheckout } from '../../lib/services/StripeService';

export default function AccountDetails(props: { user: UserWithRelations }) {
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [paymentMethods] = useState<any[]>(props.user.paymentMethods);
  const [serviceAddresses, setServiceAddresses] = useState<Address[] | null>(
    props.user.addresses.filter((address) => address.type === 'service')
  );

  const [billingaddress, setBillingAddress] = useState<Address | null>(
    props.user.billingAddress
  );

  const [readyForCheckout, setReadyForCheckout] = useState(false);

  useEffect(() => {
    if (billingaddress && paymentMethods.length > 0) {
      setReadyForCheckout(true);
    }
  }, [billingaddress, paymentMethods]);

  return (
    <>
      <PageContainer title="Account Details">
        <Container mb="xl" mt="xl">
          <Center>
            <Button
              size="lg"
              variant="outline"
              rightIcon={!loadingCheckout && <IconArrowRight />}
              disabled={!readyForCheckout && !loadingCheckout}
              onClick={() => {
                setLoadingCheckout(true);
                redirectToCheckout(
                  'subscription',
                  new URL(window.location.origin + `/subscriptions/save`),
                  new URL(window.location.href),
                  getCartItems()
                ).finally(() => setLoadingCheckout(false));
              }}
            >
              {loadingCheckout ? <Loader /> : 'Proceed to Checkout'}
            </Button>
          </Center>
        </Container>

        <Container mb={'2rem'} mt={'4rem'}>
          <AddressList
            title="Service Addresses"
            titleSize="md"
            mapHeight="500px"
            mapWidth="100%"
            mapZoom={12}
            type="service"
            addresses={props.user.addresses}
            user={props.user}
          />{' '}
        </Container>

        <Container mb={'2rem'}>
          <BillingAddress
            user={props.user}
            billingaddress={billingaddress}
            setBillingAddress={setBillingAddress}
            center={true}
          />
        </Container>

        <Container size="xl" mb={'2rem'}>
          <PaymentMethodsList user={props.user} checkout />
        </Container>
      </PageContainer>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getSessionUserProps(context);
};
