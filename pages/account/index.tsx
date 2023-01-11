import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { JSXElementConstructor } from 'react';
import PaymentMethodsList from '../../components/billing/PaymentMethodsList';

const Center = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);
const Loader = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Loader as JSXElementConstructor<any>
  )
);
const Title = dynamic(() => import('@mantine/core').then((mod) => mod.Title));

export default function Account() {
  const { status, data: session }: { status: String; data: any } = useSession({
    required: false,
  });
  const user = session?.user;

  if (status === 'loading') {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <Center>
        <Title>Account</Title>
      </Center>
      <Center>
        <div>
          {user.name} - {user.email}
        </div>
      </Center>

      <PaymentMethodsList user={user} />
    </>
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
