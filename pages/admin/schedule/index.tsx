import { Button, Flex, Loader, Stack } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next/types';
import { JSXElementConstructor, useEffect, useState } from 'react';
import { ServiceScheduleRoutes } from '../../../components/locations/ServiceScheduleRoutes';
import PageContainer from '../../../components/PageContainer';
import { notifyError } from '../../../helpers/notify';
import { ProviderWithAddress } from '../../../lib/services/api/ApiProviderService';
import {
  ServiceScheduleRouteWithAddress,
  ServiceScheduleWithRoute,
} from '../../../lib/services/api/ApiScheduleService';
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

const RouteMap = dynamic(
  () => import('../../../components/locations/RouteMap'),
  { ssr: false }
);

const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

export default function PickupScheduleIndex() {
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ProviderWithAddress | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [pickupsForDate, setPickupsForDate] = useState<
    ServiceScheduleRouteWithAddress[]
  >([]);

  const getPickupsForDate = async (date: Date, regenerate: boolean = false) => {
    setLoading(true);
    await getScheduleForDate(date, regenerate)
      .then((serviceSchedule: ServiceScheduleWithRoute) => {
        setPickupsForDate(serviceSchedule.scheduleRoutes ?? []);
        setProvider(serviceSchedule.provider);
      })
      .catch((error) => {
        notifyError(500, 'api', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const optimizeRoute = async () => {
    setLoading(true);
    if (pickupsForDate.length > 0) {
      // Optimize Route
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isBrowser()) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) {
      getPickupsForDate(date);
    } else {
      setPickupsForDate([]);
    }
  }, [date]);

  return (
    <PageContainer title="Pickup Schedule" size="xl">
      <Space h="xl" />
      <Center>
        {loading ? (
          <Loader />
        ) : (
          <Stack>
            <Center>
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                gap={{ base: 'sm', sm: 'lg' }}
                justify={{ sm: 'center' }}
              >
                <Group>
                  Date:{' '}
                  <DatePicker
                    value={date}
                    minDate={new Date(new Date().getDate() - 1)}
                    onChange={(newDate) => setDate(newDate)}
                  />
                </Group>
                {date && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        getPickupsForDate(date, true);
                      }}
                    >
                      Regenerate Schedule For Day
                    </Button>
                    {/* {pickupsForDate.length > 0 && (
                      <Button onClick={optimizeRoute}>Optimize Route</Button>
                    )} */}
                  </>
                )}
              </Flex>
            </Center>
            {date && <ServiceScheduleRoutes data={pickupsForDate} />}
            {pickupsForDate.length > 0 && provider && (
              <RouteMap routes={pickupsForDate} provider={provider} />
            )}
          </Stack>
        )}
      </Center>
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
