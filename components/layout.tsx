import Navbar from "./navbar";
import { useSession } from "next-auth/react";
import { defaultNavBarLinks, buildNavbarLinks } from "../data/navbar-links";
import { ReactElement, useEffect, useState } from "react";
import React from "react";
import dynamic from "next/dynamic";

const AppShell = dynamic(() =>
  import("@mantine/core").then((mod) => mod.AppShell)
);

const Layout = ({ children }: { children: ReactElement<any> }) => {
  const { data: session, status } = useSession();
  const [links, setLinks] = useState(defaultNavBarLinks);
  const [linksHaveBeenBuilt, setLinksHaveBeenBuilt] = useState(false);

  useEffect(() => {
    if (!linksHaveBeenBuilt) {
      setLinks(buildNavbarLinks(session?.user));
      setLinksHaveBeenBuilt(true);
    }
  }, [status, session, linksHaveBeenBuilt]);

  return (
    <AppShell padding={0} navbar={<Navbar links={links} />}>
      <div style={{ marginTop: "120px" }}>{children}</div>
    </AppShell>
  );
};

export default Layout;
