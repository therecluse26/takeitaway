import { Button, Center, Divider, Stack, Text, Title } from '@mantine/core';
import { Subscription } from '@prisma/client';
import { IconArrowRight } from '@tabler/icons';
import { GetServerSideProps } from 'next';
import PageContainer from '../../../components/PageContainer';
import getSessionUserProps from '../../../lib/props/sessionUser';
import { getSubscriptionById } from '../../../lib/services/api/ApiSubscriptionService';

export default function SubscriptionSuccess(props: {
  subscription: Subscription;
}) {
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
          <Button rightIcon={<IconArrowRight />}>
            Assign Pickups To Locations
          </Button>
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
      ...getSessionUserProps(context),
      subscription: JSON.parse(JSON.stringify(subscription)),
    },
  };
};
