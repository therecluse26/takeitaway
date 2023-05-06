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

export async function getAvailableProviders(date: Date) {
    return await axios.get(`/api/providers/available/${date.toISOString()}`).then(response => response.data);
}

export async function updateAvailability(providerId: string, availability: Availability[]|null): Promise<void> {
    const validationErrors = validateAvailability(availability);
    if (validationErrors.length > 0) {
        throw validationErrors;
    }
    return await axios.put(`/api/providers/${providerId}/availability`, availability);
}

export async function createProviderFromUser(userId: string){
    return await axios.post("/api/users/" + userId + "/create-provider");
}

export function validateAvailability(availability: Availability[] | null): string[] {
    let errors: string[] = [];

    // Allow no availability
    if(availability === null) {
        return errors;
    }
    
    for(let i = 0; i < availability.length; i++) {
        const day = availability[i];

        const startEmpty = day.start === undefined || day.start === null || day.start === '' || day.start === '00:00:00' || day.start === '00:00';
        const endEmpty = day.end === undefined || day.end === null || day.end === '' || day.end === '00:00:00' || day.end === '00:00';

        if(startEmpty && endEmpty) {
            errors.push(`Start and end time are required for ${day.day}`);
        } else {
            if(startEmpty && !endEmpty) {
                errors.push(`Start time is required for ${day.day}`);
            }
            if(endEmpty && !startEmpty) {
                errors.push(`End time is required for ${day.day}`);
            }
        }
        
    }
    return errors;
}

export const daysOfTheWeek = [
    {number: 0, label: "Sunday", value: "sunday"},
    {number: 1, label: "Monday", value: "monday"},
    {number: 2, label: "Tuesday", value: "tuesday"},
    {number: 3, label: "Wednesday", value: "wednesday"},
    {number: 4, label: "Thursday", value: "thursday"},
    {number: 5, label: "Friday", value: "friday"},
    {number: 6, label: "Saturday", value: "saturday"},
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

export function convertISOStringToTime(dateTime: string): string {
    return dateTime.split("T")[1].slice(0, -1);
}

// Convert 24 hour utc time to 12 hour time in the local timezone
export function convertUtcTimeToLocalTime(utcTime: Date|string, ): string {
     // Convert localtime to string if it is a date
     if(typeof utcTime === "object") {
        utcTime = utcTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    const utcTimeParts = utcTime.split(":");
    const utcHour = parseInt(utcTimeParts[0]);
    const utcMinute = parseInt(utcTimeParts[1]);

    const localTime = new Date();
    localTime.setUTCHours(utcHour);
    localTime.setUTCMinutes(utcMinute);

    return localTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

export function convertLocalTimeToUTCTimeString(localTime: Date|string|null|undefined): string {

    if( localTime === null || localTime === undefined ) {
        return '00:00';
    }
    // Convert localtime to string if it is a date
    if(typeof localTime === "object") {
        localTime = localTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    const localTimeParts = localTime.split(":");
    const localHour = parseInt(localTimeParts[0]);
    const localMinute = parseInt(localTimeParts[1]);

    const utcTime = new Date();
    utcTime.setHours(localHour);
    utcTime.setMinutes(localMinute);
    const isoTime = utcTime.toISOString();

    // Return hh:mm only from ISO string
    return isoTime.split("T")[1].slice(0, -8);
}

// Check if the current time is within a given range
export function currentTimeWithinRange(start: string, end: string): boolean {
    const startParts = start.split(":");
    const endParts = end.split(":");
    const now = new Date();

    const startDateTime = new Date();
    startDateTime.setUTCHours(parseInt(startParts[0]));
    startDateTime.setUTCMinutes(parseInt(startParts[1]));
    
    const endDateTime = new Date();
    endDateTime.setUTCHours(parseInt(endParts[0]));
    endDateTime.setUTCMinutes(parseInt(endParts[1]));

    return now >= startDateTime && now <= endDateTime;
}

// Get month schedule for provider's availability
export function getMonthSchedule(availability: Prisma.JsonArray|Prisma.JsonValue|null, timeOff: ProviderTimeOff[]|null, currentDate: Date): Date[] {
    const monthSchedule: Date[] = [];

    if (!availability) {
        return monthSchedule;
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const parsedAvailabilities = availability as Availability[];

    // Loop through each day of the month
    for(let i = 1; i <= 31; i++) {
        const day = new Date(year, month, i);
        if(timeOff?.find(t => t.day === day)) {
            continue;
        }
        const dayNumber = day.getUTCDay();
        
        const dayName = daysOfTheWeek?.find(weekDay => weekDay?.number === dayNumber)?.value;
        const availabilityForDay = parsedAvailabilities.find(a => a.day === dayName) as Availability;

        // If the day is available, check if the current time is within the availability range
        if(availabilityForDay) {
            // Check if the provider is off on this day
            monthSchedule.push(day);
        }

        // If the day is not available, check the next day
        else {
            continue;
        }
    }

    return monthSchedule;
}

export function getNextAvailableDateFromSchedule(schedule: Date[], timeOff: ProviderTimeOff[]|null, date: Date): Date|null {
    const nextAvailableDate = schedule.find(s => s >= date);

    if(!nextAvailableDate) {
        return null;
    }

    // If the next available date is on a day that the provider is off, check the next day
    if(timeOff?.find(t => t.day === nextAvailableDate)) {
        return getNextAvailableDateFromSchedule(schedule, timeOff, nextAvailableDate);
    }

    return nextAvailableDate;
}

// Get the next available date for a provider based on their availability and time off.
// This function will check the next 3 months if the current month is not available.
export function getNextScheduledDate(availability: Prisma.JsonArray|Prisma.JsonValue|null, timeOff: ProviderTimeOff[]|null, date: Date, levelsDeep: number = 0): Date|null 
{    
    if (levelsDeep > 3) {
        return null;
    }

    // Get given month's schedule
    let nextAvailable = getNextAvailableDateFromSchedule(getMonthSchedule(availability, timeOff, date), timeOff, date);

    if(!nextAvailable) {
        // Check the next month recursively
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        nextAvailable = getNextScheduledDate(availability, timeOff, nextMonth, levelsDeep + 1);
    }
    
    return nextAvailable;
}



// Get the start and end times for a given Availability array and date
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
        
        if(dayNameToDayOfWeek(parsedAvailability.day) === dayOfWeek)
        {
            return currentTimeWithinRange(parsedAvailability.start, parsedAvailability.end);
        }
    });

    if(available) {

        if(timeOff && timeOff.find(t => t.day.getTime() === dateToCheck.getTime())) {
            return false;
        }
        
        return true;
    }

    return false;
}

export function providerIsAvailableOnDate(availability: Prisma.JsonArray|Prisma.JsonValue|null, dateToCheck: Date, timeOff: ProviderTimeOff[]|null): boolean 
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
        
        if(dayNameToDayOfWeek(parsedAvailability.day) === dayOfWeek)
        {
            return true;
        }
    });

    if(available) {

        if(timeOff && timeOff.find(t => t.day.getTime() === dateToCheck.getTime())) {
            return false;
        }
        
        return true;
    }

    return false;
}
