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
} from '@mantine/core';
import { Provider } from '@prisma/client';
import { useDebouncedValue, useViewportSize } from '@mantine/hooks';
import { USEQUERY_STALETIME } from '../../../data/configuration';
import PageContainer from '../../../components/PageContainer';
import { getProviders } from '../../../lib/services/ProviderService';
import Link from 'next/link';
import { formatAddress } from '../../../lib/services/AddressService';
import { IconSearch } from '@tabler/icons';

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
  const [selectedRecords, setSelectedRecords] = useState<Provider[]>([]);
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
          <Box sx={{ height: height - 300, width: width - 100 }}>
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
                  width: 150,
                  ellipsis: true,
                  sortable: true,
                  render: (record: any): any => {
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
                  width: 150,
                  sortable: true,
                  visibleMediaQuery: aboveXsMediaQuery,
                  render: (record: any): any => {
                    return <>{formatAddress(record.address)}</>;
                  },
                },
                {
                  accessor: 'serviceRadius',
                  title: 'Service Radius',
                  width: 150,
                  sortable: true,
                  visibleMediaQuery: aboveXsMediaQuery,
                  render: (record: any): any => {
                    return <>{record.serviceRadius + ' miles'}</>;
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
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
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
