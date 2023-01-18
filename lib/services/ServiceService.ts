import { Service } from "@prisma/client";

export function getFeaturedServices(): Promise<Service[]> {
    return fetch(`/api/services/featured`).then(res => res.json());
}