import {
  Box,
  Center,
  Container,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
} from '@mantine/core';
import { Passion_One } from '@next/font/google';
import HomepageBanner from '../components/homepage/HomepageBanner';

const minRowHeight = '400px';

const passionOne = Passion_One({
  weight: '700',
  subsets: ['latin'],
  style: 'normal',
  fallback: ['Helvetica', 'Arial', 'Verdana', 'sans-serif'],
});

const useStyles = createStyles((theme) => ({
  row: {
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  grayBackground: {
    paddingTop: '4rem',
    paddingBottom: '4rem',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    minHeight: minRowHeight,
  },
  headerAbout: {
    fontFamily: passionOne.style.fontFamily,
    lineHeight: '1',
    fontSize: '2.5rem',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.blue[5]
        : theme.colors.blue[7],
  },

  headerServiceArea: {
    fontFamily: passionOne.style.fontFamily,
    lineHeight: '1',
    fontSize: '3.4rem',
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
      <Container size="xl" className={classes.row}>
        <Box style={{ minHeight: minRowHeight }}>
          <Center style={{ marginTop: '2rem' }}>
            <h2 className={classes.headerAbout}>
              Short-Term Rental and Residential On Demand Trash Services
            </h2>
          </Center>
          <Container size="md" mt="1" mb="lg">
            <Divider color={'gray'} mt="0" mb="0" />
          </Container>

          <Grid>
            <Grid.Col span={6}>
              <p>
                We are a residential and short-term rental on demand trash
                services-based business. We have subscription services available
                for customers that may own one, or multiple rental properties
                that are rented out on a short-term basis (i.e. Airbnb, Vrbo,
                etc.) and need on demand trash services where the trash is
                picked up after your rental is complete, or, if you are a
                residential customer that just forgot to take the trash out on
                your scheduled city day and need someone to just “Take It Away”,
                then we are the company for you!
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
      <Container fluid className={(classes.row, classes.grayBackground)}>
        <Container size="xl">
          <Box>
            <Grid>
              <Grid.Col span={6}>
                <h1 className={classes.headerServiceArea}>
                  Service Area - Phoenix Metro, Arizona
                </h1>
                <p>
                  We service the Phoenix/Maricopa County areas but are hoping to
                  have the opportunity to expand to other communities soon!
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
              </Grid.Col>
              <Grid.Col span={6}>
                <Image
                  src={'/images/Phoenix-Map.jpg'}
                  width="560px"
                  alt={'Phoenix Map'}
                />
              </Grid.Col>
            </Grid>
          </Box>
        </Container>
      </Container>
    </>
  );
}
