import { Button, Modal } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import getStripe from '../../components/billing/get-stripe';
import { Elements } from '@stripe/react-stripe-js';
import { redirectToCheckout } from '../../lib/services/StripeService';

export default function AddPaymentMethod() {
  const { status, data: session }: { status: String; data: any } = useSession({
    required: false,
  });
  const user = session?.user;
  const stripePromise = getStripe();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState('');

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  console.log('user', user);

  type AppearanceType = {
    theme: 'stripe' | 'night' | 'flat' | 'none';
  };

  const appearance: AppearanceType = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  const successUrl = new URL(
    window.location.origin + `/api/users/${user.id}/payment-methods/save`
  );

  const cancelUrl = new URL(window.location.href);

  return (
    <div>
      <Button
        onClick={() => {
          redirectToCheckout('setup', successUrl, cancelUrl);
        }}
      >
        New Payment Method
      </Button>
      <Modal
        opened={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Elements options={options} stripe={stripePromise}></Elements>
      </Modal>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      authorization: {
        requiresSession: true,
      },
    },
  };
}
