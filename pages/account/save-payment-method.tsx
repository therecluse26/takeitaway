import { Center, Loader } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { savePaymentMethodToUser } from '../../lib/services/UserService';
export default function Account() {
  const router = useRouter();
  const { session_id } = router.query;

  const { data: session }: { status: String; data: any } = useSession({
    required: false,
  });

  const user = session?.user;

  useEffect(() => {
    // Save payment method to user by session_id
    if (user && session_id) {
      savePaymentMethodToUser(user, session_id as string).then(() => {
        router.push('/account');
      });
    }
  }, [session_id, user, router]);

  return (
    <Center>
      <Loader></Loader>
    </Center>
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
