import { Address, PrismaClient, User } from "@prisma/client";
import NodeGeocoder, { Options } from 'node-geocoder';
import { GEOCODER_CONFIG } from "../../../data/configuration";
import { formatAddress } from "../AddressService";
import { updateCustomerBillingAddress } from "./ApiStripeService";

const prisma = new PrismaClient()

async function getAddress(id: string): Promise<Address> {
  const address = await prisma.address.findUnique({
    where: { id },
  });

  if (!address) {
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

async function geocodeAddress(address: Address | string): Promise<Address> {

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

async function getUserAddresses(id: string): Promise<Address[]> {
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

export { updateAddress, getAddress, getUserAddresses, geocodeAddress }