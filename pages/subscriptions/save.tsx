import { Center, Loader } from '@mantine/core';
import { Subscription } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PageContainer from '../../components/PageContainer';
import { notifyError } from '../../helpers/notify';
import {
  clearCart,
  saveSubscriptionToUser,
} from '../../lib/services/CheckoutService';

export default function SaveSubscription() {
  const router = useRouter();
  const { session_id } = router.query;

  const { data: session }: { status: String; data: any } = useSession({
    required: false,
  });

  const user = session?.user;

  useEffect(() => {
    // Save payment method to user by session_id
    if (user && session_id) {
      saveSubscriptionToUser(user, session_id as string)
        .then((resp) => {
          const subscription: Subscription = resp.data;
          clearCart();
          router.push(`/subscriptions/success/${subscription.id}`);
        })
        .catch((err) => {
          notifyError(err.response.status, 'api');
          router.push(`/subscriptions/failure`);
        });
    }
  }, [session_id, user, router]);

  return (
    <PageContainer>
      <Center>
        <Loader></Loader>
      </Center>
    </PageContainer>
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
