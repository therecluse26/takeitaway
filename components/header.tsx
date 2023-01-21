import {
  Burger,
  Container,
  createStyles,
  Grid,
  Group,
  Header,
  Loader,
  MediaQuery,
  Text,
  UnstyledButton,
} from "@mantine/core";
import UserButton from "./user-button";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { navigationLinks } from "../helpers/navigationLinks";
import ShoppingCartButton from "./checkout/ShoppingCartButton";
import { Session } from "next-auth";
import SubscribeButton from "./header/SubscribeButton";
import { companyInfo } from "../data/messaging";
import { IconPhoneCall } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  header: {
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

  topSection: {
    marginTop: 0,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[5]
        : theme.colors.blue[7],
    height: "48px",
  },
  mainSection: {
    paddingTop: 16,

    height: "90px",
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.white[0] : theme.white,
    // padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    paddingTop: 10,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.colors.blue[7],
    },

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
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
    fontSize: theme.fontSizes.md,
    // fontWeight: 400,

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
  session: Session | null;
}

const HeaderTabs = function ({
  links,
  burgerOpened,
  toggleBurgerOpened,
  closeNavbarCallback,
  mounted = true,
  session = null,
}: HeaderTabsProps) {
  const { classes, cx } = useStyles();

  return (
    <>
      <Header height={"126px"} fixed={true} className={classes.header}>
        <Container fluid className={classes.topSection}>
          <Grid style={{ height: "40px" }}>
            <Grid.Col
              sm={"auto"}
              offsetSm={2}
              xs={12}
              offsetXs={0}
              sx={{ height: "100%", marginTop: "6px" }}
            >
              <UnstyledButton
                component={"a"}
                href={"tel:" + companyInfo.phoneNumberRaw}
                sx={{ height: "100%", color: "white" }}
              >
                <Group spacing="xs">
                  <IconPhoneCall />

                  <Text weight={700} color="white">
                    {companyInfo.phoneNumber}
                  </Text>
                </Group>
              </UnstyledButton>
            </Grid.Col>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Grid.Col span={6}></Grid.Col>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Grid.Col span="auto" offset={-2}>
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
              </Grid.Col>
            </MediaQuery>
          </Grid>
        </Container>
        <Container className={classes.mainSection} size="lg">
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
            <Group>
              <SubscribeButton />
              <ShoppingCartButton session={session} />
            </Group>
          </Group>
        </Container>
      </Header>
    </>
  );
};

export default HeaderTabs;
