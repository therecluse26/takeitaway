import { DataTableSortStatus } from 'mantine-datatable/dist/types/DataTableSortStatus';
import axios from 'axios';
import { PaginatedProvidersWithRelations } from './api/ApiProviderService';
import { Availability } from '../../types/provider';
import { Prisma, ProviderTimeOff } from '@prisma/client';

export async function getProviders({page, recordsPerPage, sortStatus: { columnAccessor: sortAccessor, direction: sortDirection }, searchQuery}
: { searchQuery: string|null, page: number|null|undefined; recordsPerPage: number; sortStatus: DataTableSortStatus; }): Promise<PaginatedProvidersWithRelations> 
{
    return await axios.get("/api/providers", {
        params: {
            page: page, 
            skip: (page ? page - 1 : 0) * recordsPerPage,
            recordsPerPage: recordsPerPage, 
            sortAccessor: sortAccessor, 
            sortDirection: sortDirection,
            searchQuery: searchQuery
        }
    }).then(response => response.data);
}

export const daysOfTheWeek = [
    {label: "Sunday", value: "sunday"},
    {label: "Monday", value: "monday"},
    {label: "Tuesday", value: "tuesday"},
    {label: "Wednesday", value: "wednesday"},
    {label: "Thursday", value: "thursday"},
    {label: "Friday", value: "friday"},
    {label: "Saturday", value: "saturday"},
];

function dayNameToDayOfWeek(dayName: string): number {
    switch(dayName) {
        case "sunday":
            return 0;
        case "monday":
            return 1;
        case "tuesday":
            return 2;
        case "wednesday":
            return 3;
        case "thursday":
            return 4;
        case "friday":
            return 5;
        case "saturday":
            return 6;
        default:
            return -1;
    }
}

export const localTimeZone = new Date()
  .toLocaleDateString('en-US', {
    day: '2-digit',
    timeZoneName: 'short',
  })
  .slice(4);

// Convert 24 hour utc time to 12 hour time in the local timezone
export function convertUtcTimeToLocalTime(utcTime: string, ): string {
    const utcTimeParts = utcTime.split(":");
    const utcHour = parseInt(utcTimeParts[0]);
    const utcMinute = parseInt(utcTimeParts[1]);

    const localTime = new Date();
    localTime.setUTCHours(utcHour);
    localTime.setUTCMinutes(utcMinute);

    return localTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

export function getStartAndEndTimes(availability: Prisma.JsonArray|Prisma.JsonValue, dateToCheck: Date): {start: string|null, end: string|null}
{
    const parsedAvailability = availability as Availability[];

    // Find the availability for the day of the week
    const availabilityForDay = parsedAvailability.find(a => dayNameToDayOfWeek(a.day) === dateToCheck.getDay()) as Availability;

    if(!availabilityForDay) {
        return {start: null, end: null};
    }

    return {start: convertUtcTimeToLocalTime(availabilityForDay.start), end: convertUtcTimeToLocalTime(availabilityForDay.end)}
}

export function formatStartAndEndTimes(availability: Prisma.JsonArray|Prisma.JsonValue|null, dateToCheck: Date): string
{
    const {start, end} = getStartAndEndTimes(availability, dateToCheck);

    if(start && end) {
        return `${start} - ${end}`;
    }

    return "";
}

// Checks if a provider is available on a given date
export function isAvailable(availability: Prisma.JsonArray|Prisma.JsonValue|null, dateToCheck: Date, timeOff: ProviderTimeOff[]|null): boolean 
{
    if (!availability) {
        return false;
    }

    const dayOfWeek = dateToCheck.getDay();

    let availabilityArray = Array.isArray(availability) ? availability : [availability];

    availabilityArray = availabilityArray as Array<Availability>;

    const available = availabilityArray.find(a => {
        if (typeof a === 'undefined' || a === null){
            return false;
        }
       
        const parsedAvailability = a as Availability;
        
        return dayNameToDayOfWeek(parsedAvailability.day) === dayOfWeek
    });

    if(available) {

        if(timeOff && timeOff.find(t => t.day.getTime() === dateToCheck.getTime())) {
            return false;
        }
        
        return true;
    }

    return false;
}
