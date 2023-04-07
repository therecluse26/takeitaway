import { Address, Provider } from "@prisma/client";
// import { User } from "next-auth";
import { Availability } from "../../../types/provider";
import { daysOfTheWeek } from "../ProviderService";
import { AddressWithPickupPreferences } from "./ApiAddressService";
import { getNextBillingCyclesForActiveSubscriptions } from "./ApiSubscriptionService";
import { getUserWithAddresses, UserWithAddresses } from "./ApiUserService";

// Generate pickup schedule for a given date based on provider availability and user address pickup preferences
export async function getScheduleForDate(date: Date) {

    const billingCycles = await getNextBillingCyclesForActiveSubscriptions();
    let pickupPreferences = [];

    for (const billingCycle of billingCycles) {
        // Get pickups for date from user pickup preferences
        pickupPreferences.push(await getUserPickupsForDate(billingCycle.userId, date))
    }

    return pickupPreferences.filter((pickupPreference) => {
        return pickupPreference !== undefined && pickupPreference !== null;
    }).flat();
}

// Check if a provider is available on a given date
function providerIsAvailableOnDate(provider: Provider, date: Date): boolean {
    const providerAvailability = provider.availability as Availability[];
    for (const availability of providerAvailability) {
        if (availability.day === daysOfTheWeek.find((dow) => dow.number === date.getDay())?.value) {
            return true
        }
    }

    return false;
}

function getWeekNumber(date: Date) {
    const d = new Date(+date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil((((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 8.64e7) + 1) / 7);
}

function getWeekNumberInMonth(date: Date) {
    const w = getWeekNumber(date);
    const d = new Date(date.getFullYear(), date.getMonth(), 1);
    const w1 = getWeekNumber(d);
    return w - w1 + 1;
}

export async function getUserPickupsForDate(userId: string, date: Date) {

    const user: UserWithAddresses|null = await getUserWithAddresses(userId);

    return user?.addresses.filter((address: AddressWithPickupPreferences) => {
        const preferences = address.pickupPreferences.filter((pickupPreference) => {
            if (pickupPreference.weekNumber !== getWeekNumberInMonth(date)) {
                return false;
            }
            if (pickupPreference.weekday === daysOfTheWeek.find((dow) => dow.number === date.getDay())?.value) {
                return true;
            }
        }).filter((pickupPreference) => {
            return pickupPreference !== undefined && pickupPreference !== null;
        })

        if (preferences.length > 0) {
            return true;
        }
    }).map((address: AddressWithPickupPreferences) => {
        return addressScheduleResponse(address, user);
    });
}

function addressScheduleResponse(address: Address|AddressWithPickupPreferences, user: UserWithAddresses|null){
    return {
        id: address.id,
        userId: address.userId,
        userName: user?.name,
        street: address.street,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        latitude: address.latitude,
        longitude: address.longitude,
        inServiceArea: address.inServiceArea,
    }
}