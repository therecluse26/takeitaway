import axios from 'axios';
import { Address } from '@prisma/client';

async function geocodeAddress(address: Address): Promise<Address>{
    return await axios.get(`/api/address/${address.id}/geocode`).then(response => response.data );
}

export { geocodeAddress };