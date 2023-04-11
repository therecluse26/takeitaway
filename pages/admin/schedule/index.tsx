import { Loader, Stack } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { Address } from '@prisma/client';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next/types';
import { JSXElementConstructor, useEffect, useState } from 'react';
import AddressList from '../../../components/locations/AddressList';
import PageContainer from '../../../components/PageContainer';
import { notifyError } from '../../../helpers/notify';
import { getScheduleForDate } from '../../../lib/services/ScheduleService';

const Center = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);
const Group = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Group as JSXElementConstructor<any>)
);
const Space = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Space as JSXElementConstructor<any>)
);
const Avatar = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Avatar as JSXElementConstructor<any>
  )
);
const Container = dynamic(() =>
  import('@mantine/core').then(
    (mod) => mod.Container as JSXElementConstructor<any>
  )
);
const Title = dynamic(() =>
  import('@mantine/core').then((mod) => mod.Title as JSXElementConstructor<any>)
);

const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

export default function PickupScheduleIndex() {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | null>(null);
  const [pickupsForDate, setPickupsForDate] = useState<Address[]>([]);

  useEffect(() => {
    if (isBrowser()) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if (date) {
      getScheduleForDate(date)
        .then((pickups: Address[]) => {
          setPickupsForDate(pickups);
        })
        .catch((error) => {
          notifyError(500, 'api', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setPickupsForDate([]);
      setLoading(false);
    }
  }, [date]);

  return (
    <PageContainer title="Pickup Schedule">
      {loading ? (
        <Loader />
      ) : (
        <Center>
          <Stack>
            <Group>
              {' '}
              Date:{' '}
              <DatePicker
                minDate={new Date(new Date().getDate() - 1)}
                onChange={(newDate) => setDate(newDate)}
              />
            </Group>
            <AddressList type="service" addresses={pickupsForDate} />
          </Stack>
        </Center>
      )}
    </PageContainer>
  );
}

export const getStaticProps: GetServerSideProps = async () => {
  return {
    props: {
      authorization: {
        requiresSession: true,
        requiredPermissions: [
          'admin:dashboard',
          'schedule:read',
          'schedule:write',
        ],
      },
    },
  };
};