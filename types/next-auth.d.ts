import { User as PrismaUser } from "@prisma/client"

declare module "next-auth" {
    interface User extends PrismaUser {
        role: string,
    }

    interface Session {
        user: User
    }
    
    interface Profile {
        email_verified?: boolean
    }
}