export default function Page() {
  return <h1>Admin Dashboard</h1>;
}

export async function getStaticProps() {
  return {
    props: {
      authorization: {
        requiresSession: true,
        requiredPermissions: ['admin:dashboard'],
      },
    },
  };
}
