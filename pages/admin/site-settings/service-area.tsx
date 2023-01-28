export default function ServiceArea() {
  return <>Service Area</>;
}

export async function getStaticProps() {
  return {
    props: {
      authorization: {
        requiresSession: true,
        requiredPermissions: ['admin:config'],
      },
    },
  };
}
