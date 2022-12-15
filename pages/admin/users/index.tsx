import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../../lib/services/UserService';
import { useMantineTheme, Box } from '@mantine/core';
import { User } from '@prisma/client';

const PAGE_SIZE = 100;

export default function UserTable() {
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
  const handleSortStatusChange = (status: DataTableSortStatus) => { setPage(1); setSortStatus(status); };
  const [selectedRecords, setSelectedRecords] = useState<User[]>([]);

  const { data, isFetching } = useQuery(
    ["users", sortStatus.columnAccessor, sortStatus.direction, page],
    async () => getUsers({ recordsPerPage: PAGE_SIZE, page, sortStatus }),
    { refetchOnWindowFocus: false }
  );

  const {
    breakpoints: { xs: xsBreakpoint },
  } = useMantineTheme();
  const aboveXsMediaQuery = `(min-width: ${xsBreakpoint}px)`;

  return (
    // place the data table in a height-restricted container to make it vertically-scrollable
    <Box sx={{ height: 320 }}>
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
        ]}
        records={data?.users}
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
  );
}
  



export async function getStaticProps() {
    return {
      props: {
        authorization: {
          requiresSession: true,
          requiredPermissions: ['admin:dashboard', 'users:read']
        }
      },
    }
  }