import { Center, Loader } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PageContainer from '../../components/PageContainer';
import { savePaymentMethodToUser } from '../../lib/services/UserService';

export default function SavePaymentMethod() {
  const router = useRouter();
  const { session_id, checkout } = router.query;
  const { data: session }: { status: String; data: any } = useSession({
    required: false,
  });

  const user = session?.user;

  useEffect(() => {
    // Save payment method to user by session_id
    if (user && session_id) {
      savePaymentMethodToUser(user, session_id as string).then(() => {
        if (checkout) {
          router.push('/checkout/account-details');
          return;
        }
        router.push('/account');
      });
    }
  }, [session_id, user, router, checkout]);

  return (
    <PageContainer>
      <Center>
        <Loader />
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
