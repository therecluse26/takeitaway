import React, { FC, useCallback, useEffect, useState } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { MantineProvider } from '@mantine/core';
import Layout from '../components/layout';
import AppSkeleton from '../components/app-skeleton';
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const [hasMounted, setHasMounted] = useState(false)
    const [loaded, setLoaded] = useState(false)
   
    useEffect(() => {
        setHasMounted(true)
        setLoaded(true)
    }, [])

    if (!hasMounted) {
        return <AppSkeleton />
    }

    return ( 
        <div suppressHydrationWarning>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */
                    colorScheme: 'light',
                }}
            >
                <SessionProvider session={session}>
                    <Auth>
                        {hasMounted && loaded ?
                            <Layout>
                                <Component {...pageProps} />
                            </Layout> : 
                            <AppSkeleton />}
                    </Auth>
                </SessionProvider>
              
            </MantineProvider>
        </div > )
}

const Auth = ({ children } : { children: any } ): ReactJSXElement => {
    const { status } = useSession({ required: false })

    if (status === "loading") {
        return <></>
    }

    return (children)
}