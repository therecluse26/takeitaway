import Link from 'next/link';

export default function Account() {
  return (
    <div>
      <h1>Account</h1>
      <Link href={'/account/add-payment-method'}>Add Payment Method</Link>
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
