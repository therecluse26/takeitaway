import axios from "axios";

export async function getScheduleForDate(date: Date, regenerate: boolean = false) : Promise<any>
{
    return await axios.get(`/api/schedule/${date.toISOString()}?regenerate=${regenerate}`).then(response => response.data);
}