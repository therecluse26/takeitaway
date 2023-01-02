import { DataTableSortStatus } from 'mantine-datatable/dist/types/DataTableSortStatus';
import axios from 'axios';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

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

async function getUserPaymentMethods(id: string|Number): Promise<any> 
{
    return await axios.get(`/api/users/${id}/payment-methods`).then(response => response.data);
}

async function savePaymentMethodToUser(user: User, session_id: string){
    return await axios.post(`/api/users/${user.id}/payment-methods/save`, {session_id: session_id});
}

export { getUsers, getUser, getUserPaymentMethods, savePaymentMethodToUser };