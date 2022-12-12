import React, { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Avatar, Group, Menu, UnstyledButton, Text, Loader } from "@mantine/core";
import { IconChevronDown, IconSettings, IconLogout } from "@tabler/icons";

export default function Component({ classes, theme, cx }) {
    const { data: session, status } = useSession()
    const user = session?.user;

    const [userMenuOpened, setUserMenuOpened] = useState(false);

    if (status === 'loading') {
        // Add loading spinner here
        return (<><Loader size={'xs'} variant={'dots'} /></>)
    }

    return (
        user ? (
            <Menu
                width={260}
                position="bottom-end"
                transition="pop-top-right"
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
            >
                <Menu.Target>
                    <UnstyledButton
                        className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                    >
                        <Group spacing={7}>
                            <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                {user.name}
                            </Text>
                            <IconChevronDown size={12} stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>

                    <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account settings</Menu.Item>

                    <Menu.Item onClick={() => { signOut() }} icon={<IconLogout size={14} stroke={1.5} />}>Logout</Menu.Item>

                </Menu.Dropdown>
            </Menu >
        ) : (
            <UnstyledButton onClick={() => { signIn() }} sx={{ height: 30 }}>
                Sign In
            </UnstyledButton>
        )
    )
}