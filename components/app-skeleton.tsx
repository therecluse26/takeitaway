import { Container } from '@mantine/core';
import { defaultNavBarLinks } from '../data/navbar-links';
import Footer from './footer';
import Navbar from './navbar';

export default function AppSkeleton() {
  return (
    <>
      <Navbar links={defaultNavBarLinks} />
        <main>
          <Container fluid={true}/>
        </main>
      <Footer/>
    </>
  );
}