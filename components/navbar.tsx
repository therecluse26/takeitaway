import {
    createStyles,
    Container,
    Group,
    Menu,
    Burger,
    Center,
    Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconChevronDown,
} from '@tabler/icons';

import UserButton from './user-button';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
    header: {
        paddingTop: theme.spacing.sm,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
            }`,
        marginBottom: 40,
    },

    mainSection: {
        paddingBottom: theme.spacing.sm,
    },

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },

        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('xs')]: {
            display: 'none',
        },
    },

    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
          display: 'none',
        },
      },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
    
        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      },
      linkLabel: {
        marginRight: 5,
      },

}));

interface HeaderTabsProps {
    links: any[];
}

export default function HeaderTabs({ links }: HeaderTabsProps) {
    const { classes, cx } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);

    const items = links.map((link) => {
        const menuItems = link.links?.map((item: any) => (
          <Menu.Item key={item.link}>
            <Link key={item.label} href={item.link} className={classes.link}>
              {item.label}
            </Link>
          </Menu.Item>
        ));
    
        if (menuItems) {
          return (
            <Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
              <Menu.Target>
                <Link key={link.label} href={link.link} className={classes.link}>
                  <Center>
                    <span className={classes.linkLabel}>{link.label}</span>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Center>
                </Link>
              </Menu.Target>
              <Menu.Dropdown>{menuItems}</Menu.Dropdown>
            </Menu>
          );
        }
    
        return (
          <Link key={link.label} href={link.link} className={classes.link}>
            {link.label}
          </Link>
        );
      });
    return (
        <div className={classes.header}>
            <Container className={classes.mainSection}>
                <Group position="apart">

                    <Link href={"/"}>
                        <Image src={"/logo-small.png"} alt={"logo"} height={52} width={120} />
                    </Link>

                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                    <Group spacing={5} className={classes.links}>
                        {items}
                    </Group>

                    <UserButton classes={classes} cx={cx} />
                    
                </Group>
            </Container>
           
        </div>
    );
}