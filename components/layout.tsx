import Navbar from './navbar'
import Footer from './footer'
import { useSession } from "next-auth/react";
import {defaultNavBarLinks, buildNavbarLinks} from '../data/navbar-links';
import { useEffect, useState } from 'react';
import React from 'react';

const Layout = ({ children }) => {
    const { data: session, status } = useSession()
    const [links, setLinks] = useState(defaultNavBarLinks);

    useEffect(()=>{
        setLinks(
            buildNavbarLinks(session?.user)
        )
    }, [status, session])
    
    return (
        <>
            <Navbar links={links} />
            <main> {children} </main>
            <Footer />
        </>
    )
}

export default React.memo(Layout)