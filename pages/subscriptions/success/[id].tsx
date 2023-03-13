import {
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Subscription } from '@prisma/client';
import { IconArrowRight } from '@tabler/icons';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import getSessionUserProps from '../../../lib/props/sessionUser';
import { getSubscriptionById } from '../../../lib/services/api/ApiSubscriptionService';

const redirectLink = '/pickups';

export default function SubscriptionSuccess(props: {
  subscription: Subscription;
}) {
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [redirectingText, setRedirectingText] = useState('Redirecting in');

  useEffect(() => {
    if (timeRemaining < 1) {
      setRedirectingText('Redirecting...');
      setTimeRemaining(0);
      // Redirect to redirectLink
      window.location.assign(redirectLink);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((timeRemaining) => timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  return (
    <PageContainer>
      <Center>
        <Stack>
          <Title order={1}>Thank You!</Title>
          <Text>
            Your subscription for{' '}
            <b>
              {props.subscription.pickupsPerCycle}{' '}
              {props.subscription.cycleRecurrence}
            </b>{' '}
            pickups has been activated.
          </Text>
          <Text>You will be charged on the 1st of every month.</Text>
          <Text>You can cancel your subscription at any time.</Text>
          <Divider />
          <Button
            rightIcon={<IconArrowRight />}
            component={Link}
            href={redirectLink}
          >
            Assign Pickups To Locations
          </Button>
          <Center>
            <Text>
              <Group>
                <Loader size="sm" /> {redirectingText} {timeRemaining}
              </Group>
            </Text>
          </Center>
        </Stack>
      </Center>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let subscription = await getSubscriptionById(context?.params?.id as string);

  if (!subscription) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await getSessionUserProps(context)),
      subscription: JSON.parse(JSON.stringify(subscription)),
    },
  };
};
