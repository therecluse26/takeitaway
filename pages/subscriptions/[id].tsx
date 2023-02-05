import { Center } from '@mantine/core';
import { Subscription } from '@prisma/client';
import { GetServerSideProps } from 'next';
import PageContainer from '../../components/PageContainer';
import getSessionUserProps from '../../lib/props/sessionUser';
import { getSubscriptionById } from '../../lib/services/api/ApiSubscriptionService';

export default function ManageSubscription(props: {
  subscription: Subscription;
}) {
  return (
    <PageContainer>
      <Center>{JSON.stringify(props.subscription)}</Center>
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
