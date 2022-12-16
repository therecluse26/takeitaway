import { DataTableSortStatus } from 'mantine-datatable/dist/types/DataTableSortStatus';
import axios from 'axios';

async function getUsers({page, recordsPerPage, sortStatus: { columnAccessor: sortAccessor, direction: sortDirection }, cursor}
: { page: number|null|undefined; recordsPerPage: number; sortStatus: DataTableSortStatus; cursor: Number|string|null|undefined }): Promise<any> 
{
    const result = await axios.get("/api/users", {
        params: {
            page: page, 
            recordsPerPage: recordsPerPage, 
            sortAccessor: sortAccessor, 
            sortDirection: sortDirection,
            cursor: cursor
        }
    });

    return result.data;
}

export { getUsers };