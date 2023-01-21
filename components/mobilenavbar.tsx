import {
  Center,
  createStyles,
  Divider,
  Loader,
  Navbar,
  Stack,
} from "@mantine/core";
import UserButton from "./user-button";

import React from "react";
import { navigationLinks } from "../helpers/navigationLinks";
import { Session } from "next-auth";

const useStyles = createStyles((theme) => ({
  navbar: {
    top: "126px",
    fontSize: theme.fontSizes.lg,
    width: "100%",
    paddingTop: 20,
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    textAlign: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },
  },

  outer: {
    width: "100%",
  },

  burger: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    textAlign: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 700,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
  linkLabel: {
    marginRight: 5,
  },
}));

interface MobileNavbarProps {
  links: any[];
  opened: boolean;
  mounted?: boolean;
  closeNavbarCallback: () => void;
  session: Session | null;
}

const MobileNavbar = function ({
  links,
  opened,
  closeNavbarCallback,
  mounted = true,
  session = null,
}: MobileNavbarProps) {
  const { classes, cx } = useStyles();

  return (
    <Navbar
      className={classes.navbar}
      width={{ base: "100%", sm: "100%" }}
      hidden={!opened}
    >
      <Center>
        <Stack spacing={5} style={{ width: "100%" }}>
          <Center>
            {mounted ? (
              <UserButton
                session={session}
                classes={classes}
                cx={cx}
                onClick={closeNavbarCallback}
              />
            ) : (
              <Loader size={"sm"} />
            )}
            <Divider />
          </Center>
          {navigationLinks(links, classes, closeNavbarCallback)}
        </Stack>
      </Center>
    </Navbar>
  );
};

export default MobileNavbar;
