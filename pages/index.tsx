import HomepageBanner from '../components/homepage/HomepageBanner';

export default function HomePage() {
  if (typeof window === 'undefined') {
    return <>Loading...</>;
  }

  return (
    <>
      <HomepageBanner />
    </>
  );
}
