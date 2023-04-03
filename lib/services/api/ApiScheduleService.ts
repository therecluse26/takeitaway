import { PickupSchedule, Provider } from "@prisma/client";
import { Availability } from "../../../types/provider";
import { getAllProviders } from "./ApiProviderService";

// Generate pickup schedule for a given date based on provider availability and user address pickup preferences
export async function getPickupSchedule(date: Date) {
    const providers = await getAllProviders();
    const pickups: PickupSchedule[] = [];

    for (const provider of providers) {
        const providerPickups = getPickupsForProvider(provider, date);
        pickups.push(...providerPickups);
    }

    return pickups;
}

// Generate pickup schedule for a given provider and date based on provider availability and user address pickup preferences  
function getPickupsForProvider(provider: Provider, date: Date) {
    const pickups: PickupSchedule[] = [];
    const providerAvailability = provider.availability as Availability[];
      for (const availability of providerAvailability) {
          if (availability.day === date.getDay()) {
              const pickup = {
                  providerId: provider.id,
                  day: date,
                  pickupTime: availability.startTime,
                  dropoffTime: availability.endTime,
              };
              pickups.push(pickup);
          }
      }
  
      return pickups;
  }
