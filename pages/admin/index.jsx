import { useSession } from "next-auth/react"

export default function Page() {
    const { data: session } = useSession()
    console.log(session?.user)

    if (session && session.user.role === "admin") {
        return (
            <div>
                <h1>Admin</h1>
                <p>Welcome to the Admin Portal!</p>
            </div>
        )
    } else {
        return (
            <div>
                <h1>You are not authorized to view this page!</h1>
            </div>
        )
    }
}