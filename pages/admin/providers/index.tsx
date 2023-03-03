import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useMantineTheme,
  Box,
  Center,
  Container,
  Anchor,
  Grid,
  TextInput,
  Text,
  Group,
} from '@mantine/core';
import { useDebouncedValue, useViewportSize } from '@mantine/hooks';
import { USEQUERY_STALETIME } from '../../../data/configuration';
import PageContainer from '../../../components/PageContainer';
import {
  formatStartAndEndTimes,
  getProviders,
  isAvailable,
  localTimeZone,
} from '../../../lib/services/ProviderService';
import Link from 'next/link';
import { formatAddress } from '../../../lib/services/AddressService';
import {
  IconClockHour3,
  IconSearch,
  IconThumbDown,
  IconThumbUp,
} from '@tabler/icons';
import { ProviderWithRelations } from '../../../lib/services/api/ApiProviderService';

const PAGE_SIZE = 15;

export default function ProviderTable() {
  const { height, width } = useViewportSize();
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });
  const handleSortStatusChange = (status: DataTableSortStatus) => {
    setPage(1);
    setSortStatus(status);
  };

  const [search, setSearch] = useState({ 'user.name': '' });
  const [debouncedSearch] = useDebouncedValue(search, 500);

  // Providers query
  const { data, isFetching } = useQuery(
    [
      'providers',
      sortStatus.columnAccessor,
      sortStatus.direction,
      page,
      debouncedSearch,
    ],
    async () =>
      getProviders({
        recordsPerPage: PAGE_SIZE,
        page,
        sortStatus,
        searchQuery: JSON.stringify(debouncedSearch),
      }),
    { refetchOnWindowFocus: false, staleTime: USEQUERY_STALETIME }
  );

  const {
    breakpoints: { xs: xsBreakpoint },
  } = useMantineTheme();
  const aboveXsMediaQuery = `(min-width: ${xsBreakpoint}px)`;

  return (
    <PageContainer title={'Manage Providers'}>
      <Container size="lg">
        <Center>
          <Box sx={{ height: height - 400, width: width - 100 }}>
            <Grid align="center" mb="md">
              <Grid.Col xs={2}>
                <TextInput
                  sx={{ flexBasis: '60%' }}
                  placeholder="Search name..."
                  icon={<IconSearch size={16} />}
                  value={search['user.name']}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      'user.name': e.currentTarget.value,
                    });
                    setPage(1);
                  }}
                />
              </Grid.Col>

              <Grid.Col xs={3}></Grid.Col>
            </Grid>

            <DataTable
              withBorder
              borderRadius="sm"
              withColumnBorders
              striped
              verticalAlignment="top"
              fetching={isFetching}
              columns={[
                {
                  accessor: 'user.name',
                  width: 100,
                  ellipsis: true,
                  sortable: true,
                  render: (record: ProviderWithRelations): any => {
                    return (
                      <Anchor
                        component={Link}
                        href={`/admin/providers/${record.id}`}
                      >
                        {record.user.name}
                      </Anchor>
                    );
                  },
                },
                {
                  accessor: 'address.id',
                  title: 'Address',
                  width: 120,
                  sortable: false,
                  visibleMediaQuery: aboveXsMediaQuery,
                  render: (record: ProviderWithRelations): any => {
                    return <>{formatAddress(record.address)}</>;
                  },
                },
                {
                  accessor: 'serviceRadius',
                  title: 'Service Radius',
                  width: 80,
                  sortable: true,
                  visibleMediaQuery: aboveXsMediaQuery,
                  render: (record: ProviderWithRelations): any => {
                    return <>{record.serviceRadius + ' miles'}</>;
                  },
                },
                {
                  accessor: 'availability',
                  title: `Availability (${localTimeZone})`,
                  width: 120,
                  sortable: false,
                  visibleMediaQuery: aboveXsMediaQuery,
                  render: (record: ProviderWithRelations): any => {
                    return (
                      <>
                        {isAvailable(
                          record.availability,
                          new Date(),
                          record.timeOff
                        ) ? (
                          <>
                            <Grid align="center" justify="center">
                              <Grid.Col span={4}>
                                <Group spacing={8}>
                                  <Text c="green">
                                    <IconThumbUp size={14} />
                                  </Text>

                                  <Text c="green">Available</Text>
                                </Group>
                              </Grid.Col>

                              <Grid.Col span={8}>
                                <Group spacing={8}>
                                  <IconClockHour3 size={14} />
                                  <Text size="sm">
                                    {formatStartAndEndTimes(
                                      record.availability,
                                      new Date()
                                    )}
                                  </Text>
                                </Group>
                              </Grid.Col>
                            </Grid>
                          </>
                        ) : (
                          <>
                            <Grid align="center" justify="center">
                              <Grid.Col span={12}>
                                <Group spacing={8}>
                                  <Text c="red">
                                    <IconThumbDown size={12} />
                                  </Text>
                                  <Text c="red">Unavailable</Text>
                                </Group>
                              </Grid.Col>
                            </Grid>
                          </>
                        )}
                      </>
                    );
                  },
                },
              ]}
              records={data?.data}
              page={page}
              onPageChange={setPage}
              totalRecords={data?.total}
              recordsPerPage={PAGE_SIZE}
              sortStatus={sortStatus}
              onSortStatusChange={handleSortStatusChange}
            />
          </Box>
        </Center>
      </Container>
    </PageContainer>
  );
}

export async function getStaticProps() {
  return {
    props: {
      authorization: {
        requiresSession: true,
        requiredPermissions: ['admin:dashboard', 'admin:config'],
      },
    },
  };
}
