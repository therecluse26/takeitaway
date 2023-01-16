import {
  Burger,
  Container,
  createStyles,
  Group,
  Header,
  Loader,
  MediaQuery,
} from "@mantine/core";
import UserButton from "./user-button";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { navigationLinks } from "../helpers/navigationLinks";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
    marginBottom: 40,
    zIndex: 1000,
  },

  navbar: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
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

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

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

interface HeaderTabsProps {
  links: any[];
  burgerOpened: boolean;
  toggleBurgerOpened: () => void;
  closeNavbarCallback: () => void;
  mounted?: boolean;
}

const HeaderTabs = function ({
  links,
  burgerOpened,
  toggleBurgerOpened,
  closeNavbarCallback,
  mounted = true,
}: HeaderTabsProps) {
  const { classes, cx } = useStyles();

  return (
    <Header height={"80px"} fixed={true} className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Link href={"/"}>
            <Image
              src={"/logo-small.png"}
              alt={"logo"}
              height={52}
              width={120}
            />
          </Link>

          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <Burger
              opened={burgerOpened}
              onClick={toggleBurgerOpened}
              className={classes.burger}
              size="md"
            />
          </MediaQuery>

          <Group spacing={5} className={classes.links}>
            {navigationLinks(links, classes, closeNavbarCallback)}
          </Group>

          {mounted ? (
            <UserButton
              classes={classes}
              cx={cx}
              onClick={closeNavbarCallback}
            />
          ) : (
            <Loader size={"sm"} />
          )}
        </Group>
      </Container>
    </Header>
  );
};

export default HeaderTabs;
