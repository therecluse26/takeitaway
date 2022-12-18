import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../../lib/services/UserService';
import { useMantineTheme, Box, Center } from '@mantine/core';
import { User } from '@prisma/client';
import { useViewportSize } from '@mantine/hooks';

const PAGE_SIZE = 15;

export default function UserTable() {
  const { height, width } = useViewportSize();
  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState(null)
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
  const handleSortStatusChange = (status: DataTableSortStatus) => { setPage(1); setSortStatus(status); };
  const [selectedRecords, setSelectedRecords] = useState<User[]>([]);

  // Users query
  const { data, isFetching } = useQuery(
    ["users", sortStatus.columnAccessor, sortStatus.direction, page],
    async () => getUsers({ recordsPerPage: PAGE_SIZE, page, sortStatus, cursor: cursor }),
    { refetchOnWindowFocus: false, onSuccess: (d) => {setCursor(d.cursor)}, onError: () => {setCursor(null)}}
  );

  const {
    breakpoints: { xs: xsBreakpoint },
  } = useMantineTheme();
  const aboveXsMediaQuery = `(min-width: ${xsBreakpoint}px)`;

  return (
    <Center>
      <Box sx={{ height: height - 300, width: width - 100}}>
        <Center>
          <h1>
            Manage Users
          </h1>
        </Center>

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
        requiredPermissions: ['admin:dashboard', 'users:read']
      }
    },
  }
}