import { Address, PrismaClient } from "@prisma/client";
import NodeGeocoder, { Options } from 'node-geocoder';
import {GEOCODER_CONFIG} from "../../../data/configuration";

const prisma = new PrismaClient()

async function getAddress(id: string): Promise<Address> {
  const address = await prisma.address.findUnique({
    where: { id },
  });
  
  if (!address){
    throw new Error("Address not found");
  }

  return address;
}

async function updateAddress(address: Address): Promise<Address> {
  return await prisma.address.update({
    where: { id: address.id },
    data: address,
  });
}

async function getAddressLatLong(address: Address): Promise<{latitude: number|null|undefined, longitude: number|null|undefined}> {
  const geocoder = NodeGeocoder(GEOCODER_CONFIG as Options);
  const res = await geocoder.geocode(formatAddress(address));
  if(res.length > 0){
    return {latitude: res[0].latitude, longitude: res[0].longitude}
  }

  return {latitude: null, longitude: null}
}

async function geocodeAddress(address: Address|string): Promise<Address> {

    if(typeof address === "string"){
        address = await getAddress(address)
    }

    const geocoder = NodeGeocoder(GEOCODER_CONFIG as Options);
    const geocodeResult = await geocoder.geocode(formatAddress(address));

    if(geocodeResult.length > 0){

      const {latitude, longitude, city, countryCode, state, zipcode} = geocodeResult[0];

      address.city = city ? city : address.city;
      address.country = countryCode ? countryCode : address.country;
      address.state = state ? state : address.state;
      address.zip = zipcode ? zipcode : address.zip;
      address.latitude = latitude ? latitude : address.latitude;
      address.longitude = longitude ? longitude : address.longitude;
      
      address = await updateAddress(address)

    }
  
    return address
}

function formatAddress(address: Address): string {
  return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
}

async function getUserAddresses(id: string): Promise<Address[]> {
  return await prisma.address.findMany({
    where: { userId: id },
  });
}


export {updateAddress, getAddress, getUserAddresses, formatAddress, geocodeAddress}