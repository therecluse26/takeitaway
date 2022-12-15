import { PrismaClient, User } from '@prisma/client'
import { DataTableSortStatus } from 'mantine-datatable/dist/types/DataTableSortStatus';
import axios from 'axios';

async function getUsers({page, recordsPerPage, sortStatus: { columnAccessor: sortAccessor, direction: sortDirection }} 
: { page: number; recordsPerPage: number; sortStatus: DataTableSortStatus; }): Promise<any> 
{
  
    const result = await axios.get("/api/users");
    const total = result.data.length;

    return { total, users: result.data as User[] };

}

export { getUsers };