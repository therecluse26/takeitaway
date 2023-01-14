import { createStyles, Grid, Loader } from '@mantine/core';
import HomepageBanner from '../components/homepage/HomepageBanner';
import dynamic from 'next/dynamic';
import { JSXElementConstructor, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';

import phoenixMap from '../public/images/Phoenix-Map.jpg';
import trashImage1 from '../public/images/trash-1-410x410.jpg';
import trashImage2 from '../public/images/trash-2-410x410.jpg';
import trashImage3 from '../public/images/trash-3-410x410.jpg';

const Title = dynamic(() => import('@mantine/core').then((mod) => mod.Title));

const Box = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Box as JSXElementConstructor<any>)
);

const Divider = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Divider)
);

const Group = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Group as JSXElementConstructor<any>)
);

const Image = dynamic(() => import('next/image'));

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

export default function HomePage() {
  const contactContainerRef = useRef<HTMLDivElement>(null);
  const { ref: contactRef, entry } = useIntersection({
    root: contactContainerRef.current,
    threshold: 0.0001,
  });
  const { classes } = useStyles();

  if (typeof window === 'undefined') {
    return <>Loading...</>;
  }

  return (
    <>
      <HomepageBanner />
      <Container fluid className={classes.transparentBackground}>
        <Container size="xl">
          <Box style={{ minHeight: minRowHeight }}>
            <Center style={{ marginTop: '2rem' }}>
              <Title order={2} className={classes.headerAbout}>
                Short-Term Rental and Residential On Demand Trash Services
              </Title>
            </Center>
            <Container size="md" mb="lg">
              <Divider color={'gray'} mt="0" mb="0" />
            </Container>

            <Grid gutter={40} style={{ marginTop: 40 }}>
              <Grid.Col span={12} md={6}>
                <p className={classes.lightText}>
                  We are a residential and short-term rental on demand trash
                  services-based business. We have subscription services
                  available for customers that may own one, or multiple rental
                  properties that are rented out on a short-term basis (i.e.
                  Airbnb, Vrbo, etc.) and need on demand trash services where
                  the trash is picked up after your rental is complete, or, if
                  you are a residential customer that just forgot to take the
                  trash out on your scheduled city day and need someone to just
                  “Take It Away”, then we are the company for you!
                </p>
              </Grid.Col>
              <Grid.Col span={12} md={6}>
                <Center style={{ minHeight: 200 }}>
                  <Group>
                    <Image
                      src={trashImage1}
                      alt="Trash pickup"
                      height={180}
                      width={180}
                    />
                    <Image
                      src={trashImage2}
                      alt="Dumpsters"
                      height={180}
                      width={180}
                    />
                    <Image
                      src={trashImage3}
                      alt="Trash cans"
                      height={180}
                      width={180}
                    />
                  </Group>
                </Center>
              </Grid.Col>
            </Grid>
          </Box>
        </Container>
      </Container>
      <Container fluid className={classes.grayBackground}>
        <Container size="xl">
          <Box>
            <Grid gutter={40}>
              <Grid.Col span={12} sm={6}>
                <Title>Service Area - Phoenix Metro, Arizona</Title>
                <div className={classes.lightText}>
                  <p>
                    We service the Phoenix/Maricopa County areas but are hoping
                    to have the opportunity to expand to other communities soon!
                  </p>
                  <p>
                    <b>SUMMER HOURS:</b>
                  </p>
                  <ul>
                    <li>Mon: 8AM - 5PM</li>
                    <li>Wed: 8AM - 5PM</li>
                    <li>Fri: 8AM - 5PM</li>
                    <li>Sat: 8AM - 5PM</li>
                  </ul>
                </div>
              </Grid.Col>
              <Grid.Col span={12} sm={6}>
                <Image
                  src={phoenixMap}
                  alt={'Phoenix Map'}
                  className={classes.serviceAreaImage}
                />
              </Grid.Col>
            </Grid>
          </Box>
        </Container>
      </Container>

      <Container fluid className={classes.transparentBackground}>
        <Container size={'xl'}>
          <Title>Subscriptions</Title>
          <p>Select 3 services from the backend and display them here</p>
        </Container>
      </Container>

      {/* Lazily loads contact us form on partial container intersection */}
      <Container
        fluid
        className={classes.grayBackground}
        ref={contactContainerRef}
      >
        <div ref={contactRef}>
          {entry?.isIntersecting ? (
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
