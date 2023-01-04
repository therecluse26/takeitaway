import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { JSXElementConstructor, useState } from 'react';
import PaymentMethodsList from '../../components/billing/PaymentMethodsList';
import { deleteAccount } from '../../lib/services/UserService';

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
const Divider = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Divider as JSXElementConstructor<any>
  )
);
const Button = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Button as JSXElementConstructor<any>
  )
);
const Modal = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Modal as JSXElementConstructor<any>)
);
const Group = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Group as JSXElementConstructor<any>)
);

export default function Account() {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
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
        <h1>Account</h1>
      </Center>
      <Center>
        <div>
          {user.name} - {user.email}
        </div>
      </Center>

      <PaymentMethodsList user={user} />

      <Divider my="xl" label="Danger Zone" labelPosition="center" />

      <Center>
        <Button
          color="red"
          variant="outline"
          uppercase
          onClick={() => {
            setDeleteModalOpened(true);
          }}
        >
          Delete Account
        </Button>
        <Modal
          size={600}
          opened={deleteModalOpened}
          onClose={() => {
            setDeleteModalOpened(false);
          }}
        >
          <Center>Are you sure you want to delete your account?</Center>
          <Center>
            <Group mt="xl">
              <Button
                color="red"
                onClick={() => {
                  deleteAccount(user);
                }}
              >
                Yes, delete my account
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpened(false);
                }}
              >
                No, take me back to safety
              </Button>
            </Group>
          </Center>
        </Modal>
      </Center>
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
