import axios from 'axios';
import { Address } from '@prisma/client';

export async function geocodeAddress(address: Address): Promise<Address>{
    return await axios.get(`/api/address/${address.id}/geocode`).then(response => response.data );
}

export async function submitAddress(form: any): Promise<any>{
    return await axios.post(`/api/address/create`, form).then(response => response.data );
}