import { createStyles, Header, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons";
import UserButton from "./user-button";
import { RouterTransition } from "./RouterTransition";

import dynamic from "next/dynamic";
import { JSXElementConstructor } from "react";

const Link = dynamic(() => import("next/link"));
const Container = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Container as JSXElementConstructor<any>
  )
);
const Burger = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Burger as JSXElementConstructor<any>
  )
);
const Center = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);
const Image = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Image as JSXElementConstructor<any>)
);
const Loader = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Loader as JSXElementConstructor<any>
  )
);
const Group = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Group as JSXElementConstructor<any>)
);

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
}

export default function HeaderTabs({ links, mounted = true }: HeaderTabsProps) {
  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item: any) => (
      <Menu.Item key={item.link + "_item"}>
        <Link
          key={item.label + "_link"}
          href={item.link}
          className={classes.link}
        >
          {item.label}
        </Link>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <>
          <RouterTransition />
          <Menu
            key={link.label + "_menu"}
            trigger="hover"
            exitTransitionDuration={0}
          >
            <Menu.Target>
              <Link
                key={link.label + "_menu_link"}
                href={link.link}
                className={classes.link}
              >
                <Center>
                  <span className={classes.linkLabel}>{link.label}</span>
                  <IconChevronDown size={12} stroke={1.5} />
                </Center>
              </Link>
            </Menu.Target>
            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
          </Menu>
        </>
      );
    }

    return (
      <Link
        key={link.label + "_base_link"}
        href={link.link}
        className={classes.link}
      >
        {link.label}
      </Link>
    );
  });
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
  );
}
