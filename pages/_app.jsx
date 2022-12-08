import React, { useEffect, useState } from "react"
import { SessionProvider, useSession } from "next-auth/react"

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
            <SessionProvider session={session}>
                {Component.auth ? (
                    <Auth>
                        <Component {...pageProps} />
                    </Auth>
                ) : (
                    <Component {...pageProps} />
                )}
            </SessionProvider>
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