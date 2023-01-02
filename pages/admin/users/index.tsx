import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../../lib/services/UserService';
import {
  useMantineTheme,
  Box,
  Center,
  Grid,
  TextInput,
  Anchor,
} from '@mantine/core';
import { User } from '@prisma/client';
import { useDebouncedValue, useViewportSize } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import Link from 'next/link';
import { USEQUERY_STALETIME } from '../../../data/configuration';

const PAGE_SIZE = 15;

export default function UserTable() {
  const { height, width } = useViewportSize();
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'name',
    direction: 'asc',
  });
  const handleSortStatusChange = (status: DataTableSortStatus) => {
    setPage(1);
    setSortStatus(status);
  };
  const [selectedRecords, setSelectedRecords] = useState<User[]>([]);
  const [search, setSearch] = useState({ name: '', email: '' });
  const [debouncedSearch] = useDebouncedValue(search, 500);

  // Users query
  const { data, isFetching } = useQuery(
    [
      'users',
      sortStatus.columnAccessor,
      sortStatus.direction,
      page,
      debouncedSearch,
    ],
    async () =>
      getUsers({
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
    <Center>
      <Box sx={{ height: height - 300, width: width - 100 }}>
        <Center>
          <h1>Manage Users</h1>
        </Center>

        <Grid align="center" mb="md">
          <Grid.Col xs={2}>
            <TextInput
              sx={{ flexBasis: '60%' }}
              placeholder="Search name..."
              icon={<IconSearch size={16} />}
              value={search.name}
              onChange={(e) => {
                setSearch({ ...search, name: e.currentTarget.value });
                setPage(1);
              }}
            />
          </Grid.Col>
          <Grid.Col xs={2}>
            <TextInput
              sx={{ flexBasis: '60%' }}
              placeholder="Search email..."
              icon={<IconSearch size={16} />}
              value={search.email}
              onChange={(e) => {
                setSearch({ ...search, email: e.currentTarget.value });
                setPage(1);
              }}
            />
          </Grid.Col>
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
              accessor: 'name',
              width: 150,
              ellipsis: true,
              sortable: true,
              render: (record: User): any => {
                return (
                  <Anchor component={Link} href={`/admin/users/${record.id}`}>
                    {record.name}
                  </Anchor>
                );
              },
            },
            {
              accessor: 'email',
              sortable: true,
              visibleMediaQuery: aboveXsMediaQuery,
            },
            {
              accessor: 'role',
              title: 'Role',
              width: 150,
              sortable: true,
              visibleMediaQuery: aboveXsMediaQuery,
            },
            {
              accessor: '_count.addresses',
              title: 'Locations',
              width: 150,
              sortable: false,
              visibleMediaQuery: aboveXsMediaQuery,
            },
            {
              accessor: '_count.subscriptions',
              title: 'Subscriptions',
              width: 150,
              sortable: false,
              visibleMediaQuery: aboveXsMediaQuery,
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
  );
}

export async function getStaticProps() {
  return {
    props: {
      authorization: {
        requiresSession: true,
        requiredPermissions: ['admin:dashboard', 'users:read'],
      },
    },
  };
}
