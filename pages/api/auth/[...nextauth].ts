import NextAuth, { Awaitable, NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { getUserCount } from "../../../lib/services/UserService"
import { rolePermissions } from "./permissions"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.NEXTAUTH_FROM_EMAIL,
        }),
        // Add more providers here
    ],
    callbacks: {
        async signIn({ user }) {
            // Set first user to superadmin if only one user exists
            if (await getUserCount()) {
                user = await prisma.user.update({ where: { id: user.id }, data: { role: 'superadmin' } }).finally(() => {
                    prisma.$disconnect();
                });
            }
            return user.id ? true : false;
        },
        async session({ session, user }: { session: any, user: any }) {
            // Add role value to user object so it is passed along with session
            if (session.user && user) {
                session.user.role = user.role;
                session.user.permissions = rolePermissions(user.role)
            }
            return session;
        }
    },
}

export default NextAuth(authOptions)