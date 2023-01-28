import axios from 'axios';
import { Address } from '@prisma/client';
import { notifyError } from '../../helpers/notify';

export function formatAddress(address: Address): string {
    return `${address.street}${address.street2 ? ' ' + address.street2 : ""}, ${address.city}, ${address.state} ${address.zip}`;
  }

export async function geocodeAddress(address: Address): Promise<Address>{
    try {
        return await axios.get(`/api/address/${address.id}/geocode`).then(response => response.data );
    } catch (err: any) {
        notifyError(err?.response.status, "api")
        return address;
    }
}

export async function submitAddress(form: any): Promise<any>{
    return await axios.post(`/api/address/create-or-update`, form).then(response => response.data );
}