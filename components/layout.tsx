import Navbar from "./navbar";
import { useSession } from "next-auth/react";
import { defaultNavBarLinks, buildNavbarLinks } from "../data/navbar-links";
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import React from "react";
import dynamic from "next/dynamic";
import { IconArrowUp } from "@tabler/icons";
import { useWindowScroll } from "@mantine/hooks";
import FooterBar from "./footer";

const AppShell = dynamic(() =>
  import("@mantine/core").then((mod) => mod.AppShell)
);
const Affix = dynamic(() => import("@mantine/core").then((mod) => mod.Affix));
const Transition = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Transition)
);
const Button = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Button as JSXElementConstructor<any>
  )
);
const Layout = ({ children }: { children: ReactElement<any> }) => {
  const { data: session, status } = useSession();
  const [links, setLinks] = useState(defaultNavBarLinks);
  const [linksHaveBeenBuilt, setLinksHaveBeenBuilt] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    if (!linksHaveBeenBuilt) {
      setLinks(buildNavbarLinks(session?.user));
      setLinksHaveBeenBuilt(true);
    }
  }, [status, session, linksHaveBeenBuilt]);

  return (
    <AppShell
      padding={0}
      navbar={<Navbar links={links} />}
      footer={<FooterBar />}
    >
      <div style={{ marginTop: "120px" }}>
        <>
          {children}
          <Affix position={{ bottom: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button
                  variant="default"
                  style={transitionStyles}
                  onClick={() => scrollTo({ y: 0 })}
                >
                  <IconArrowUp size={16} />
                </Button>
              )}
            </Transition>
          </Affix>
        </>
      </div>
    </AppShell>
  );
};

export default Layout;
