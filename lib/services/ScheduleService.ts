import axios from "axios";
import { ServiceScheduleWithRoute } from "./api/ApiScheduleService";

export async function getScheduleForDate(date: Date, regenerate: boolean = false) : Promise<ServiceScheduleWithRoute>
{
    return await axios.get(`/api/schedule/${date.toISOString()}?regenerate=${regenerate}`).then(response => response.data);
}