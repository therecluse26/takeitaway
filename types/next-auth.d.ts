import NextAuth from "next-auth"
import { TRole } from "../data/permissions"

declare module "next-auth" {
    interface User {
        role: string,
    }

    interface Session {
        user: User
    }
}