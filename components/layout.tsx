// components/layout.js

import Navbar from './navbar'
import Footer from './footer'
import NavBarLinks from '../data/navbar-links';

export default function Layout({ children, user }) {
    return (
        <>
            <Navbar links={NavBarLinks} user={user} />
            <main> {children} </main>
            <Footer />
        </>
    )
}