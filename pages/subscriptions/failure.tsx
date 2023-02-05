import { Text, Center, Stack, Button } from '@mantine/core';
import Link from 'next/link';
import { HomeButton } from '../../components/errors/take-me-home-button';
import PageContainer from '../../components/PageContainer';
import { companyInfo } from '../../data/messaging';

export default function SaveSubscription() {
  return (
    <PageContainer title={'Error'}>
      <Stack>
        <Center>
          <Text>There was an error processing your subscription.</Text>
        </Center>
        <Center>
          <Text>
            Please try again or contact us at{' '}
            <Button
              variant="subtle"
              pr={4}
              pl={4}
              component={Link}
              href={'tel:' + companyInfo.phoneNumberRaw}
            >
              {companyInfo.phoneNumber}
            </Button>
          </Text>
        </Center>
        <Center>
          <HomeButton />
        </Center>
      </Stack>
    </PageContainer>
  );
}
