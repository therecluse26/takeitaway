import { Address, PrismaClient, Provider, ServiceLog, ServiceSchedule, ServiceScheduleItem, ServiceType, User } from "@prisma/client";
import { Availability } from "../../../types/provider";
import { daysOfTheWeek } from "../ProviderService";
import { AddressWithPickupPreferences } from "./ApiAddressService";
import { getUserCurrentBillingCycle } from "./ApiBillingCycleService";
import { getNearestProviderByAddress, getProvidersWithAvailability, ProviderWithAddress, ProviderWithRelations, ProviderWithTimeOff } from "./ApiProviderService";
import { getNextBillingCyclesForActiveSubscriptions } from "./ApiSubscriptionService";
import { getUserWithAddresses, UserWithAddresses } from "./ApiUserService";

const prisma = new PrismaClient();

export type ServiceScheduleWithProvider = ServiceSchedule & {
    provider: Provider;
}

export type ServiceScheduleWithRoute = ServiceSchedule & {
    provider: ProviderWithAddress;
    scheduleItems: ServiceScheduleItemWithAddress[];
}

export type ServiceScheduleItemWithAddress = ServiceScheduleItem & {
    user: User;
    address: Address;
}

export type ServiceScheduleItemWithRelations = ServiceScheduleItem & {
    user: User;
    address: Address;
    serviceSchedule: ServiceScheduleWithProvider;
}

export async function getServiceScheduleItemWithRelations(routeId: string): Promise<ServiceScheduleItemWithRelations> {

    return await prisma.serviceScheduleItem.findFirstOrThrow({
        where: {
            id: routeId
        },
        include: {
            serviceSchedule: {
                include: {
                    provider: true
                }
            },
            user: true,
            address: true,
        }
    });

}

// Generate pickup schedule for a given date based on provider availability and user address pickup preferences
export async function getScheduleForDate(date: Date, regenerate: boolean = false): Promise<ServiceScheduleWithRoute> {

    const existingSchedule = await checkForExistingServiceSchedule(date);

    if (existingSchedule) {
        if (regenerate) {
            await deleteServiceSchedule(existingSchedule?.id);
        } else {
            return existingSchedule;
        }
    }

    const billingCycles = await getNextBillingCyclesForActiveSubscriptions();
    let scheduledPickups: Address[] = [];

    const providers = (await getProvidersWithAvailability(date)).filter((provider) => {
        return providerIsAvailableOnDate(provider, date);
    }) as ProviderWithRelations[];

    for (const billingCycle of billingCycles) {
        // Get pickups for date from user pickup preferences
        const pickupsForDate = await getUserPickupsForDate(billingCycle.userId, date, providers);
        scheduledPickups.push(...pickupsForDate)
    }

    const pickups = scheduledPickups.filter((pickupPreference) => {
        return pickupPreference !== undefined && pickupPreference !== null;
    }).flat();

    // Create service schedule
    // TODO: separate by provider for multiple provider support
    const schedule = await createServiceSchedule(date, providers[0], pickups);

    return schedule;
}

export async function deleteServiceSchedule(scheduleId: string) {
    return await prisma.serviceSchedule.delete({
        where: {
            id: scheduleId
        }
    });
}

export async function checkForExistingServiceSchedule(date: Date): Promise<ServiceScheduleWithRoute | null> {
    return await prisma.serviceSchedule.findFirst({
        where: {
            date: {
                equals: date.toISOString()
            }
        },
        include: {
            scheduleItems: {
                include: {
                    user: true,
                    address: true
                }
            },
            provider: {
                include: {
                    address: true
                }
            }
        }
    });
}

export async function createServiceSchedule(date: Date, provider: Provider, addresses: Address[]): Promise<ServiceScheduleWithRoute> {
    let routeOrder = 0;
    const schedule = await prisma.serviceSchedule.create({
        data: {
            providerId: provider.id,
            date: date.toISOString(),
            count: addresses.length,
            scheduleItems: {
                create: addresses.map((address) => {
                    return {
                        addressId: address.id,
                        userId: address.userId,
                        order: routeOrder++
                    }
                })
            }
        }
    });

    return await prisma.serviceSchedule.findFirstOrThrow({
        where: {
            id: schedule.id
        },
        include: {
            scheduleItems: {
                include: {
                    user: true,
                    address: true
                }
            },
            provider: {
                include: {
                    address: true
                }
                
            }
        }
    });
}

export async function completePickup(serviceScheduleItemId: string, notes: string | null = null, date: Date = new Date(), type: ServiceType = "pickup_recurring"): Promise<ServiceScheduleItemWithRelations> {

    const serviceScheduleItem = await getServiceScheduleItemWithRelations(serviceScheduleItemId);

    markServiceRouteAsCompleted(serviceScheduleItemId);

    await createServiceLog(
        serviceScheduleItemId,
        serviceScheduleItem.serviceSchedule,
        serviceScheduleItem.user,
        serviceScheduleItem.address,
        notes,
        date,
        type
    );

    return await getServiceScheduleItemWithRelations(serviceScheduleItemId);
}

export async function markServiceRouteAsCompleted(routeId: string): Promise<ServiceScheduleItem> {
    return prisma.serviceScheduleItem.update({
        where: {
            id: routeId
        },
        data: {
            completed: true
        }
    });
}

export async function createServiceLog(
    serviceScheduleItemId: string,
    serviceSchedule: ServiceSchedule,
    user: User,
    address: Address,
    notes: string | null = null,
    date: Date,
    serviceType: ServiceType = "pickup_recurring",
    completed: boolean = true): Promise<ServiceLog> {

    return await prisma.serviceLog.create({
        data: {
            type: serviceType,
            serviceScheduleItemId: serviceScheduleItemId,
            billingCycleId: (await getUserCurrentBillingCycle(user.id))?.id ?? null,
            addressId: address.id,
            providerId: serviceSchedule.providerId,
            notes: notes,
            completed: completed,
            createdAt: date.toISOString(),
            updatedAt: date.toISOString()
        }
    });
}

// Check if a provider is available on a given date
function providerIsAvailableOnDate(provider: ProviderWithTimeOff | ProviderWithRelations, date: Date): boolean {
    const providerAvailability = provider.availability as Availability[];
    for (const availability of providerAvailability) {
        if (availability.day === daysOfTheWeek.find((dow) => dow.number === date.getDay())?.value) {
            // Check time off
            if (provider.timeOff) {
                for (const timeOff of provider.timeOff) {
                    if (timeOff.day === date) {
                        return false;
                    }
                }
            }

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

export async function getUserPickupsForDate(userId: string, date: Date, providers: ProviderWithRelations[] = []): Promise<any[]> {

    const user: UserWithAddresses | null = await getUserWithAddresses(userId);

    if (!user) {
        return [];
    }

    return await Promise.all(user.addresses.filter((address: AddressWithPickupPreferences) => {
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
        return false;
    }).map(async (address: AddressWithPickupPreferences) => {
        // Get nearest provider by address lat/long and provider service radius
        const provider = await getNearestProviderByAddress(address, providers);

        return addressScheduleResponse(address, provider?.id);
    }));
}

function addressScheduleResponse(address: Address | AddressWithPickupPreferences, providerId: string) {
    return {
        id: address.id,
        type: address.type,
        userId: address.userId,
        providerId: providerId,
        street: address.street,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        latitude: address.latitude,
        longitude: address.longitude,
        inServiceArea: address.inServiceArea,
        pickupsAllocated: address.pickupsAllocated,
        instructions: address.instructions,
    } as Address & { providerId: string };
}