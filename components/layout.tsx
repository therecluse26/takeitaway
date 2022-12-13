// components/layout.js

import Navbar from './navbar'
import Footer from './footer'
import NavBarLinks from '../data/navbar-links';

export default function Layout({ children }) {
    return (
        <>
            <Navbar links={NavBarLinks} />
            <main> {children} </main>
            <Footer />
        </>
    )
}