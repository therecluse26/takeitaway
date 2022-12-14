export default function Account() {
  return (
    <div>
      <h1>Account</h1>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      authorization: {
        requiresSession: true,
      }
    },
  }
}