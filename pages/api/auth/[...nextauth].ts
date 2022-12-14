import NextAuth, { Account, NextAuthOptions, User } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"

// Providers
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email"
import AzureADProvider from "next-auth/providers/azure-ad";
import LinkedInProvider from "next-auth/providers/linkedin";
import Auth0Provider from "next-auth/providers/auth0";

// Custom services
import { getUserCount } from "../../../lib/services/UserService"

function buildProviders(){
    const providers = []

    // Add Email provider if credentials are set
    if( process.env.EMAIL_SERVER_HOST && 
        process.env.EMAIL_SERVER_PORT &&
        process.env.EMAIL_SERVER_USER &&
        process.env.EMAIL_SERVER_PASSWORD ){
            providers.push(
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
                })
            )
        }

    // Add Google provider if credentials are set
    if( process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET ){
            providers.push(
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    allowDangerousEmailAccountLinking: true
                })
            )
        }

    // Add Facebook provider if credentials are set
    if( process.env.FACEBOOK_CLIENT_ID &&
        process.env.FaceBOOK_CLIENT_SECRET ){
            FacebookProvider({
                clientId: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET
              })
        }
        
    // Add Github provider if credentials are set
    if( process.env.GITHUB_ID && 
        process.env.GITHUB_SECRET ){
            providers.push(
                GithubProvider({
                    clientId: process.env.GITHUB_ID,
                    clientSecret: process.env.GITHUB_SECRET,
                    allowDangerousEmailAccountLinking: true
                })
            )
        }
    // Add Azure AD provider if credentials are set
    if( process.env.AZURE_AD_CLIENT_ID &&
        process.env.AZURE_AD_CLIENT_SECRET &&
        process.env.AZURE_AD_TENANT_ID
        ){
            providers.push(
                AzureADProvider({
                    clientId: process.env.AZURE_AD_CLIENT_ID,
                    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
                    tenantId: process.env.AZURE_AD_TENANT_ID,
                    allowDangerousEmailAccountLinking: true
                })
            )
        }
    // Add LinkedIn provider if credentials are set
    if( process.env.LINKEDIN_CLIENT_ID &&
        process.env.LINKEDIN_CLIENT_SECRET
        ){
            providers.push(
                LinkedInProvider({
                    clientId: process.env.LINKEDIN_CLIENT_ID,
                    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
                    allowDangerousEmailAccountLinking: true
                })
            )
        }        
    // Add Auth0 provider if credentials are set
    if( process.env.AUTH0_CLIENT_ID &&
        process.env.AUTH0_CLIENT_SECRET &&
        process.env.AUTH0_ISSUER
        ){
            providers.push(
                Auth0Provider({
                    clientId: process.env.AUTH0_CLIENT_ID,
                    clientSecret: process.env.AUTH0_CLIENT_SECRET,
                    issuer: process.env.AUTH0_ISSUER,
                    allowDangerousEmailAccountLinking: true
                  })
            )
        }

    return providers
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers: buildProviders(),
    theme: {
        colorScheme: "light", // "auto" | "dark" | "light"
        brandColor: "", // Hex color code
        logo: "", // Absolute URL to image
        buttonText: "" // Hex color code
    },
    callbacks: {
        async signIn({ user, account, profile }: { user: User, account: Account, profile: any }) {
            if (account.provider === "google") {
                return !!profile.email_verified;
            }

            // Set first user to superadmin if only one user exists
            const userCount = await getUserCount();
            if (userCount === 1) {
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
            }
            return session;
        }
    },
}

export default NextAuth(authOptions)