import { Button, Center, Loader } from '@mantine/core';
import { UserPaymentMethod } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirectToCheckout } from '../../lib/services/StripeService';
import { getUserPaymentMethods } from '../../lib/services/UserService';
import { getIconForBrand } from '../../lib/utils/icon-helpers';

export default function Account() {
  const [paymentMethods, setPaymentMethods] = useState<UserPaymentMethod[]>([]);

  const { status, data: session }: { status: String; data: any } = useSession({
    required: false,
  });
  const user = session?.user;

  useEffect(() => {
    if (user) {
      getUserPaymentMethods(user.id).then((data) => {
        setPaymentMethods(data);
      });
    }
  }, [user]);

  if (status === 'loading') {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <div>
      <h1>Account</h1>

      <h2>Payment Methods</h2>
      <ul style={{ listStyleType: 'none' }}>
        {paymentMethods.map((paymentMethod) => (
          <li key={paymentMethod.id}>
            {getIconForBrand(paymentMethod.brand)} ending in{' '}
            {paymentMethod.last4}
          </li>
        ))}
      </ul>

      <Button
        onClick={() => {
          redirectToCheckout(
            'setup',
            new URL(window.location.origin + `/account/save-payment-method`),
            new URL(window.location.href)
          );
        }}
      >
        New Payment Method
      </Button>
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
