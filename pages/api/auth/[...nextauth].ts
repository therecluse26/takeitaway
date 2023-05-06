import NextAuth, { Account, AuthOptions, Profile, User } from "next-auth"
import { AdapterUser } from "next-auth/adapters";
import { NextApiRequest, NextApiResponse } from "next/types";
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


async function getUserCount(): Promise<number> {
    return await prisma.user.count();
}

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
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ""
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

export const authOptions: AuthOptions = {
    debug: !!process.env.NEXTAUTH_DEBUG === true || process.env.NODE_ENV !== "production",
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
        async signIn({ user, account, profile }: { user: User|AdapterUser, account: Account|null, profile?: Profile }) {
            // Set first user to superadmin if only one user exists
            const userCount = await getUserCount();
            if (userCount === 1) {
                user = await prisma.user.update({ where: { id: user.id }, data: { role: 'superadmin' } });
            }

            if (account?.provider === "google") {
                return !!profile?.email_verified;
            }
            
            return user.id ? true : false;
        },
        async session({ session, user }: { session: any, user: any }) {
            // Add additional properties to user object so it is passed along with session
            if (session.user && user) {
                session.user.id = user.id;
                session.user.role = user.role;
                session.user.stripeId = user.stripeId;
            }
       
            return session;
        },
    },
    session: {
       // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
}


export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Do whatever you want here, before the request is passed down to `NextAuth`

    // TODO: Add bot detection

    return await NextAuth(req, res, authOptions)
  }