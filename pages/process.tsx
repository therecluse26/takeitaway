import { Button, Center, Container, Grid, Stack, Text } from '@mantine/core';
import PageContainer from '../components/PageContainer';
import Image from 'next/image';
import trashImage1 from '../public/images/trash-1.jpg';
import trashImage2 from '../public/images/trash-2.jpg';
import trashImage3 from '../public/images/trash-3.jpg';
import { IconHomeCheck } from '@tabler/icons';
import Link from 'next/link';

export default function Process() {
  return (
    <PageContainer highlightedTitle={'Our Process'}>
      <Container size={'lg'}>
        <Grid gutter="xl">
          <Grid.Col md={8}>
            <Stack spacing={'md'}>
              <Text color="dimmed">
                If you are a short-term rental owner that runs one or multiple
                rental properties and needs rental trash removed after the
                rental is complete or even during the rental process, we offer a
                subscription services-based program where you decide the
                subscription that best fits your needs based on how many rentals
                you average per month per property that you rent out.
              </Text>
              <Text color="dimmed">
                When signing up, you’ll be asked for your credit card info which
                will automatically be charged, based on the subscription service
                you’ve chosen, once a month for the duration of your
                subscription, until it’s termination. Every time your credit/
                debit card is charged you will receive a receipt via email that
                you can use for tax purposes. If you own multiple properties
                that you rent, you’re able to subscribe to one of our plans and
                share the amount of pick-ups in between those rental properties.
                Also, if your trash cans are behind a gate and there is a gate
                code needed to collect the trash from the cans or if your
                property is in a gated community, then there will be a ‘notes’
                section when scheduling that you can enter any pertinent
                information we may need for that particular property.
              </Text>
              <Text color="dimmed">
                Rarely does a rental end on a scheduled city trash day so the
                garbage can end up sitting in your can for upwards of 6 full
                days! All that does is attract nasty smells rodents and insects
                to and around your rental property which ends up being a
                nuisance to your neighbors and future renters. What happens if
                you have a rental end one day and have another starting the next
                day and the garbage is still sitting in your trash can? We’ll
                come and get it so you won’t have to worry about that situation
                even happening. Just create an account on our website, enter in
                all pertinent info, and schedule the day you’d like the pick-up
                to take place and we’ll be there to take care of it for you on
                the same day, or within 24 hours depending on what time the
                pick-up is requested on that particular day. You also have the
                option to request a pick-up on days in the future based on your
                scheduled rental departure dates.
              </Text>
              <Text color="dimmed">
                If you are a residential homeowner and forget to take the trash
                out on your scheduled city day or just happen to be out of town
                and have trash left in your cans and would like it taken care of
                then you can schedule a one-time pick-up on our web site.
              </Text>
              <Center>
                <Button
                  size="lg"
                  leftIcon={<IconHomeCheck />}
                  component={Link}
                  href="/products"
                >
                  Register Your Property Now!
                </Button>
              </Center>
            </Stack>
          </Grid.Col>
          <Grid.Col md={4}>
            <Stack spacing={'xl'}>
              <Image
                src={trashImage1}
                alt="Trash pickup"
                height={200}
                width={320}
              />
              <Image
                src={trashImage2}
                alt="Dumpsters"
                height={200}
                width={320}
              />
              <Image
                src={trashImage3}
                alt="Trash cans"
                height={200}
                width={320}
              />
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </PageContainer>
  );
}
