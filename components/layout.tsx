import Navbar from './navbar'
import Footer from './footer'
import { useSession } from "next-auth/react";
import {defaultNavBarLinks, buildNavbarLinks} from '../data/navbar-links';
import { ReactElement, useEffect, useState } from 'react';
import React from 'react';
import { Container } from '@mantine/core';

const Layout = ({ children } : { children: ReactElement<any> }) => {
    const { data: session, status } = useSession()
    const [links, setLinks] = useState(defaultNavBarLinks);
    const [linksHaveBeenBuilt, setLinksHaveBeenBuilt] = useState(false);

    useEffect(()=>{
        if(!linksHaveBeenBuilt){
            setLinks(
                buildNavbarLinks(session?.user)
            )
            setLinksHaveBeenBuilt(true);
        }        
       
    }, [status, session, linksHaveBeenBuilt])
   
    return (
        <>
            <Navbar links={links} />
                <main> 
                    <Container fluid={true}> 
                        {children} 
                    </Container>
                </main>
            <Footer />
        </>
    )
}

export default Layout