import { DataTableSortStatus } from 'mantine-datatable/dist/types/DataTableSortStatus';
import axios from 'axios';
import { PaginatedProvidersWithRelations } from './api/ApiProviderService';
// import { Availability } from '../../types/provider';

export async function getProviders({page, recordsPerPage, sortStatus: { columnAccessor: sortAccessor, direction: sortDirection }, searchQuery}
: { searchQuery: string|null, page: number|null|undefined; recordsPerPage: number; sortStatus: DataTableSortStatus; }): Promise<PaginatedProvidersWithRelations> 
{
    return await axios.get("/api/providers", {
        params: {
            page: page, 
            skip: (page ? page - 1 : 0) * recordsPerPage,
            recordsPerPage: recordsPerPage, 
            sortAccessor: sortAccessor, 
            sortDirection: sortDirection,
            searchQuery: searchQuery
        }
    }).then(response => response.data);
}


// export async function getProviderAvailability(id: string|Number): Promise<Availability> 
// {
//     return await axios.get(`/api/providers/${id}/availability`).then(response => response.data) as Availability;
// }