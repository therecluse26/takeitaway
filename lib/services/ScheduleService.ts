import axios from "axios";

export async function getScheduleForDate(date: Date) : Promise<any>
{
    return await axios.get(`/api/schedule/${date.toISOString()}`).then(response => response.data);
}