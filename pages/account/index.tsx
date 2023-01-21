import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { JSXElementConstructor } from 'react';
import PaymentMethodsList from '../../components/billing/PaymentMethodsList';
import PageContainer from '../../components/PageContainer';

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

const Text = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Text as JSXElementConstructor<any>)
);

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
    <PageContainer title="Account">
      <Center>
        <Text>
          {user.name} - {user.email}
        </Text>
      </Center>

      <PaymentMethodsList user={user} />
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
