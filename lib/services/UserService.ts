import { DataTableSortStatus } from 'mantine-datatable/dist/types/DataTableSortStatus';
import axios from 'axios';
import { PaymentMethod } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { UserWithRelations } from './api/ApiUserService';
import { PickupPreference } from '../../types/schedule';

export function useSessionUser(): User 
{
    const { data, status} =  useSession();

    if(status !== "authenticated" || !data?.user){
        throw new Error("User not logged in");
}

    return data.user;
}

export async function getSessionUser(withRelations = false): Promise<User|UserWithRelations> 
{
    return await axios.get('/api/auth/user', {params: {withRelations: withRelations}}).then(response => response.data);
}


export async function getUsers({page, recordsPerPage, sortStatus: { columnAccessor: sortAccessor, direction: sortDirection }, searchQuery}
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

export async function getUser(id: string|Number): Promise<any> 
{
    return await axios.get(`/api/users/${id}`).then(response => response.data);
}

export async function getUserPaymentMethods(id: string|Number): Promise<any> 
{
    return await axios.get(`/api/users/${id}/payment-methods`).then(response => response.data);
}

export async function savePaymentMethodToUser(user: User, session_id: string){
    return await axios.post(`/api/users/${user.id}/payment-methods/save`, {session_id: session_id});
}

export async function setPaymentMethodAsDefault(user: User, paymentMethod: PaymentMethod): Promise<boolean>{
    return await axios.post(`/api/users/${user.id}/payment-methods/${paymentMethod.id}/set-default`);
}

export async function deleteAccount(user: User): Promise<boolean>{
    return await axios.delete(`/api/users/${user.id}/delete`);
}

export async function setUserPickupPreferences(user: User, pickupPreferences: PickupPreference[]): Promise<boolean>{
    return await axios.post(`/api/users/${user.id}/pickup-preferences`, {pickupPreferences: pickupPreferences});
}
