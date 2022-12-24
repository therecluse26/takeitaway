import { DataTableSortStatus } from 'mantine-datatable/dist/types/DataTableSortStatus';
import axios from 'axios';
import { User } from '@prisma/client';

async function getPaymentTotal(user: User){
    return await axios.get(`/api/users/${user.id}/payments`).then(response => response.data.reduce((total: Number, payment: any) => total + payment.amount, 0) );
}

async function getUsers({page, recordsPerPage, sortStatus: { columnAccessor: sortAccessor, direction: sortDirection }, searchQuery}
: { searchQuery: string|null, page: number|null|undefined; recordsPerPage: number; sortStatus: DataTableSortStatus; }): Promise<any> 
{
    return await axios.get("/api/users", {
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

async function getUser(id: string|Number): Promise<any> 
{
    return await axios.get(`/api/users/${id}`).then(response => response.data);
}

export { getUsers, getUser };