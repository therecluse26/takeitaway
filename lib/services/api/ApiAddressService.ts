import { Address, PrismaClient, User } from "@prisma/client";
import NodeGeocoder, { Options } from 'node-geocoder';
import { GEOCODER_CONFIG } from "../../../data/configuration";
import { formatAddress } from "../AddressService";
import { getAllProvidersWithAddress } from "./ApiProviderService";
import { updateCustomerBillingAddress } from "./ApiStripeService";

const prisma = new PrismaClient()

export async function getAddress(id: string): Promise<Address> {
  const address = await prisma.address.findUnique({
    where: { id },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
}

export async function updateAddress(address: Address): Promise<Address> {
  return await prisma.address.update({
    where: { id: address.id },
    data: address,
  });
}

export async function geocodeAddress(address: Address | string): Promise<Address> {

  if (typeof address === "string") {
    address = await getAddress(address)
  }

  const geocoder = NodeGeocoder(GEOCODER_CONFIG as Options);
  const geocodeResult = await geocoder.geocode(formatAddress(address));

  if (geocodeResult.length > 0) {

    const { latitude, longitude, city, countryCode, state, zipcode } = geocodeResult[0];

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

export async function getUserAddresses(id: string): Promise<Address[]> {
  return await prisma.address.findMany({
    where: { userId: id },
  });
}

export async function createOrUpdateAddress(address: Address): Promise<Address> {
  if (address.id) {
    return await prisma.address.update({
      where: { id: address.id },
      data: address,
    });
  }
  return await prisma.address.create({
    data: address,
  });
}

export async function updateBillingAddress(userId: string, address: Address): Promise<User> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { billingAddressId: address.id },
  });

  await updateCustomerBillingAddress(user, address);

  return user;
}

export async function addressIsWithinServiceArea(address: Address): Promise<boolean> {

  console.log(address.latitude, address.longitude);
  if(!address.latitude || !address.longitude) {
    return false;
  }

  for (const provider of await getAllProvidersWithAddress()) {
    if(!provider.address.latitude || !provider.address.longitude) {
      continue;
    }

    const miles = getMilesBetweenCoordinates(address.latitude, address.longitude, provider.address.latitude, provider.address.longitude);
    if (miles <= provider.serviceRadius) {
      return true;
    }

    return false;
  }
  

  // Find provider nearest to address
  // and check if address is within serviceRadius
  return true;
}


function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// https://en.wikipedia.org/wiki/Haversine_formula
function getMilesBetweenCoordinates(lat1: number,lon1: number,lat2: number,lon2: number) {
  var R = 6371; // Radius of the earth in km

  var dLat = deg2rad(lat2-lat1); 

  var dLon = deg2rad(lon2-lon1); 

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

  var d = R * c; // Distance in km

  return d * 0.621371; // Convert to miles
}
