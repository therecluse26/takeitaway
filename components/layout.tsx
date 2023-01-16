import { useSession } from "next-auth/react";
import { defaultNavBarLinks, buildNavbarLinks } from "../data/navbar-links";
import { ReactElement, useEffect, useState } from "react";
import React from "react";
import { IconArrowUp } from "@tabler/icons";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import FooterBar from "./footer";
import {
  Affix,
  AppShell,
  Button,
  LoadingOverlay,
  Transition,
} from "@mantine/core";
import Header from "./header";
import Mobilenavbar from "./mobilenavbar";

const Layout = ({ children }: { children: ReactElement<any> }) => {
  const { data: session, status } = useSession();
  const [links, setLinks] = useState(defaultNavBarLinks);
  const [linksHaveBeenBuilt, setLinksHaveBeenBuilt] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();
  const [burgerOpened, { toggle: toggleBurgerOpened, close: closeBurger }] =
    useDisclosure(false);

  useEffect(() => {
    if (!linksHaveBeenBuilt && status !== "loading") {
      setLinks(buildNavbarLinks(session?.user));
      setLinksHaveBeenBuilt(true);
    }
  }, [status, session, linksHaveBeenBuilt]);

  if (status === "loading") return <LoadingOverlay visible />;

  return (
    <>
      <AppShell
        padding={0}
        header={
          <Header
            links={links}
            closeNavbarCallback={closeBurger}
            burgerOpened={burgerOpened}
            toggleBurgerOpened={toggleBurgerOpened}
          />
        }
        navbar={
          <Mobilenavbar
            opened={burgerOpened}
            links={links}
            closeNavbarCallback={closeBurger}
          />
        }
        footer={<FooterBar />}
      >
        <div style={{ marginTop: "120px" }}>
          <>
            {children}

            {/* Scroll to top button */}
            <Affix position={{ bottom: 20, right: 20 }}>
              <Transition transition="slide-up" mounted={scroll.y > 0}>
                {(transitionStyles) => (
                  <Button
                    variant="default"
                    aria-label="Return To Top"
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
    </>
  );
};

export default React.memo(Layout);
