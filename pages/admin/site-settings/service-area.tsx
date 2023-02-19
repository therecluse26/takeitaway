import PageContainer from '../../../components/PageContainer';

export default function ServiceArea() {
  return (
    <PageContainer title="Service Area">
      <h1>test</h1>
    </PageContainer>
  );
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
