export default function Users() {
    return (
        <div>
            <h1>Users</h1>
        </div>
    )
}

export async function getStaticProps() {
    return {
      props: {
        authorization: {
          requiresSession: true,
          requiredPermission: 'users:read'
        }
      },
    }
  }