import React, { FC, useCallback, useEffect, useState } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import Layout from '../components/layout';
import AppSkeleton from '../components/app-skeleton';
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { GuardContent } from "../components/auth-guard";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const [hasMounted, setHasMounted] = useState(false)
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
      setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
   
    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return <AppSkeleton />
    }

    return ( 
        <div suppressHydrationWarning>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        /** Put your mantine theme override here */
                        colorScheme: colorScheme,
                    }}
                >
                    <SessionProvider session={session}>
                        <Authenticated>
                            {hasMounted ?
                                <Layout>
                                    <GuardContent authorization={pageProps.authorization}>
                                        <Component {...pageProps} />
                                    </GuardContent>
                                </Layout> : 
                                <AppSkeleton />}
                        </Authenticated>
                    </SessionProvider>
                
                </MantineProvider>
                </ColorSchemeProvider>
        </div > )
}

const Authenticated = ({ children } ): ReactJSXElement => {
    const { status } = useSession({ required: false })

    if (status === "loading") {
        return <AppSkeleton />
    }

    return (children)
}