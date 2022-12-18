import { DataTableSortStatus } from 'mantine-datatable/dist/types/DataTableSortStatus';
import axios from 'axios';

async function getUsers({page, recordsPerPage, sortStatus: { columnAccessor: sortAccessor, direction: sortDirection }, searchQuery}
: { searchQuery: string|null, page: number|null|undefined; recordsPerPage: number; sortStatus: DataTableSortStatus; }): Promise<any> 
{
    const result = await axios.get("/api/users", {
        params: {
            page: page, 
            skip: (page ? page - 1 : 0) * recordsPerPage,
            recordsPerPage: recordsPerPage, 
            sortAccessor: sortAccessor, 
            sortDirection: sortDirection,
            searchQuery: searchQuery
        }
    });

    return result.data;
}

export { getUsers };