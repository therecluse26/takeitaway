import React, { useEffect, useState } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { MantineProvider } from '@mantine/core';
import Layout from '../components/layout';

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        // Insert Skeleton here
        return (<>Loading...</>)
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
                    {Component.auth ? (
                        <Auth>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </Auth>
                    ) : (
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    )}
                </SessionProvider>
            </MantineProvider>
        </div >
    )
}

function Auth({ children }) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { status } = useSession({ required: true })

    if (status === "loading") {
        return <div>Loading...</div>
    }

    return children
}