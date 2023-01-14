import {
  Burger,
  Center,
  Container,
  createStyles,
  Group,
  Header,
  Loader,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons";
import UserButton from "./user-button";
import { RouterTransition } from "./RouterTransition";

import Link from "next/link";
import Image from "next/image";
import React from "react";

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

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
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
  mounted?: boolean;
  linksHaveBeenBuilt?: boolean;
}

const HeaderTabs = function ({
  links,
  mounted = true,
  linksHaveBeenBuilt = false,
}: HeaderTabsProps) {
  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link, index) => {
    const menuItems = link.links?.map((item: any) => (
      <Menu.Item key={(item.key ?? item.link) + "_top_" + index}>
        <Link
          key={(item.key ?? item.label) + "_link_" + index}
          href={item.link}
          className={classes.link}
        >
          {item.label}
        </Link>
      </Menu.Item>
    ));

    return (
      <>
        <RouterTransition
          key={(link.key ?? link.label) + "_transition_" + index}
        />
        {link?.links?.length > 0 ? (
          <Menu
            key={(link.key ?? link.label) + "_menu_" + index}
            trigger="hover"
            exitTransitionDuration={0}
          >
            <Menu.Target key={(link.key ?? link.label) + "_target_" + index}>
              <Link
                key={(link.key ?? link.label) + "_menu_link_" + index}
                href={link.link}
                className={classes.link}
              >
                <Center key={(link.key ?? link.label) + "_center_" + index}>
                  <span className={classes.linkLabel} key={"span_" + index}>
                    {link.label}
                  </span>
                  <IconChevronDown
                    size={12}
                    stroke={1.5}
                    key={"chevron" + index}
                  />
                </Center>
              </Link>
            </Menu.Target>

            <Menu.Dropdown
              key={(link.key ?? link.label) + "_dropdown_" + index}
            >
              {menuItems}
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Link
            key={(link.key ?? link.label) + "_link_" + index}
            href={link.link}
            className={classes.link}
          >
            {link.label}
          </Link>
        )}
      </>
    );
  });

  return (
    <>
      {linksHaveBeenBuilt && (
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

              <Burger
                opened={opened}
                onClick={toggle}
                className={classes.burger}
                size="sm"
              />

              <Group spacing={5} className={classes.links}>
                {items}
              </Group>

              {mounted ? (
                <UserButton classes={classes} cx={cx} />
              ) : (
                <Loader size={"sm"} />
              )}
            </Group>
          </Container>
        </Header>
      )}
    </>
  );
};

export default React.memo(HeaderTabs);
