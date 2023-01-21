import { createStyles, Loader } from '@mantine/core';
import HomepageBanner from '../components/homepage/HomepageBanner';
import dynamic from 'next/dynamic';
import { JSXElementConstructor, useEffect, useRef, useState } from 'react';
import { useIntersection } from '@mantine/hooks';

import ServicesFeatured from '../components/homepage/ServicesFeatured';
import About from '../components/homepage/About';
import ServiceArea from '../components/homepage/ServiceArea';
import { Service } from '@prisma/client';
import { getFeaturedServices } from '../lib/services/api/ApiServiceService';

const Container = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Container)
);

const Center = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);

const ContactUsForm = dynamic(
  () => import('../components/homepage/ContactUsForm')
);

const minRowHeight = '400px';

const rowClass = {
  paddingTop: '4rem',
  paddingBottom: '4rem',
};

const useStyles = createStyles((theme) => ({
  grayBackground: {
    ...rowClass,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
    minHeight: minRowHeight,
  },
  transparentBackground: {
    ...rowClass,
    backgroundColor: '#ffffff',
    minHeight: minRowHeight,
  },
  anchorOffset: {
    marginTop: -120,
    paddingTop: 120,
    display: 'block',
    position: 'relative',
    visibility: 'hidden',
  },
  headerAbout: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.blue[5]
        : theme.colors.blue[7],
  },
  lightText: {
    color: theme.colors.gray[7],
  },
  serviceAreaImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
  },
}));

export default function HomePage(props: { services: Service[] }) {
  const contactContainerRef = useRef<HTMLDivElement>(null);
  const { ref: contactRef, entry } = useIntersection({
    root: contactContainerRef.current,
    threshold: 0.0001, // Tiny threshold so it loads as soon as it's partially visible
  });
  const [contactFormHasLoaded, setContactFormHasLoaded] = useState(false);
  const { classes } = useStyles();

  useEffect(() => {
    if (entry?.isIntersecting) {
      setContactFormHasLoaded(true);
    }
  }, [entry]);

  if (typeof window === 'undefined') {
    return <>Loading...</>;
  }

  return (
    <>
      <HomepageBanner />

      <a id="about" className={classes.anchorOffset}></a>
      <Container fluid className={classes.transparentBackground}>
        <About classes={classes} height={minRowHeight} />
      </Container>

      <a id="service_area" className={classes.anchorOffset}></a>
      <Container fluid className={classes.grayBackground}>
        <ServiceArea classes={classes} />
      </Container>

      <a id="services" className={classes.anchorOffset}></a>
      <Container fluid className={classes.transparentBackground}>
        <ServicesFeatured services={props.services} />
      </Container>

      {/* Lazily loads contact us form on partial container intersection */}
      <a id="contact" className={classes.anchorOffset}></a>
      <Container
        fluid
        className={classes.grayBackground}
        ref={contactContainerRef}
      >
        <div ref={contactRef}>
          {contactFormHasLoaded ? (
            <ContactUsForm />
          ) : (
            <Center>
              <Loader></Loader>
            </Center>
          )}
        </div>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const services: Service[] = await getFeaturedServices().then((res) =>
    JSON.parse(JSON.stringify(res))
  );

  return {
    props: { services: services },
  };
}
