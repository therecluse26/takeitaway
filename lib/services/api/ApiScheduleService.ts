import { PickupSchedule } from "@prisma/client";
import { getAllProvidersWithAddress, ProviderWithAddress } from "./ApiProviderService";

export async function generatePickupScheduleForDate(date: Date): Promise<PickupSchedule[]> {
  const schedules: PickupSchedule[] = [];
  const providers = await getAllProvidersWithAddress();

  for (const provider of providers) {
    const pickups = await getPickupsForProvider(provider, date);

    if (pickups.length === 0) {
      continue;
    }

    const schedule: PickupSchedule = {
      provider: provider,
      pickups: pickups,
    };

    schedules.push(schedule);
  }

  return schedules;
}

function getPickupsForProvider(provider: ProviderWithAddress, date: Date) {
    const pickups: PickupSchedule[] = [];
    
    for (const pickup of provider.pickups) {
        if (pickup.dayOfWeek === date.getDay()) {
        pickups.push(pickup);
        }
    }
    
    return pickups;
}
