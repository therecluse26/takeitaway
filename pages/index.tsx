import { createStyles, Grid } from '@mantine/core';
import ContactUsForm from '../components/homepage/ContactUsForm';
import HomepageBanner from '../components/homepage/HomepageBanner';

import dynamic from 'next/dynamic';
import { JSXElementConstructor } from 'react';

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

const Image = dynamic(() => import('@mantine/core').then((mod) => mod.Image));

const Container = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Container)
);

const Center = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
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
}));

export default function HomePage() {
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
            <Container size="md" mt="1" mb="lg">
              <Divider color={'gray'} mt="0" mb="0" />
            </Container>

            <Grid>
              <Grid.Col span={6}>
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
              <Grid.Col span={6}>
                <Center style={{ minHeight: 400 }}>
                  <Group>
                    <Image
                      src={'/images/trash-1-410x410.jpg'}
                      height="180px"
                      width="180px"
                      alt="Trash pickup"
                    />
                    <Image
                      src={'/images/trash-2-410x410.jpg'}
                      height="180px"
                      width="180px"
                      alt="Dumpsters"
                    />
                    <Image
                      src={'/images/trash-3-410x410.jpg'}
                      height="180px"
                      width="180px"
                      alt="Trash cans"
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
            <Grid>
              <Grid.Col span={6}>
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
              <Grid.Col span={6}>
                <Image
                  src={'/images/Phoenix-Map.jpg'}
                  width="560px"
                  height="auto"
                  alt={'Phoenix Map'}
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
      <Container fluid className={classes.grayBackground}>
        <ContactUsForm />
      </Container>
    </>
  );
}
