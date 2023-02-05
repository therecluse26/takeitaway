import { Container, Grid, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import PageContainer from '../components/PageContainer';

export default function RefundReturns() {
  return (
    <PageContainer highlightedTitle={'Privacy Policy'}>
      <Container size="lg">
        <Grid gutter={'xl'}>
          <Grid.Col span={12}>
            <Title order={3}>Overview</Title>
            <Text color="dimmed">
              Take It Away Trash LLC has a strict refund policy. The statements
              below are qualifications to receive a refund. If there are any
              other reasons why you believe a refund should be given, please
              contact us at{' '}
              <Link href="mailto:info@takeitawaytrash.com">
                info@takeitawaytrash.com
              </Link>
              .
            </Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <Title order={3}>Refunds</Title>
            <Stack>
              <Text color="dimmed">
                A full refund of the monthly rate you chose will be given if the
                subscription is cancelled within 72 hours of purchase and no
                pick-ups have been used.
              </Text>
              <Text color="dimmed">
                After the 72-hour full refund window, even if no pick-ups have
                been used, all funds will be forfeited to Take It Away LLC.
              </Text>
              <Text color="dimmed">
                If you decide to cancel your subscription at any time after one
                or more of your pick-ups have been used, all funds will be
                forfeited to Take It Away LLC and any unused pick-ups will be
                lost. There will be no refunds based on unused services.
              </Text>
              <Text color="dimmed">
                If you choose to pay for a one-time pick-up ($30 value) and then
                decide to cancel that service at any time before your pick-up is
                completed, you will be issued a refund minus 20% ($6), for a
                refund of $24.
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={12}>
            <Title order={3}>Need help?</Title>
            <Text color="dimmed">
              Contact us at{' '}
              <Link href="mailto:info@takeitawaytrash.com">
                info@takeitawaytrash.com
              </Link>{' '}
              for questions related to refunds and returns.
            </Text>
          </Grid.Col>
        </Grid>
      </Container>
    </PageContainer>
  );
}
