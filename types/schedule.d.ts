import { Weekday } from "@prisma/client";

export type PickupPreference = {
    addressId: string;
    weekNumber: number;
    weekday: Weekday;
  };