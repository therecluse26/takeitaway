import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  IconChevronDown,
  IconSettings,
  IconLogout,
  IconUser,
} from "@tabler/icons";
import { userCan } from "../lib/services/PermissionService";
import {
  Menu,
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Loader,
} from "@mantine/core";
import Link from "next/link";

export default function UserButton({
  classes,
  cx,
}: {
  classes: any;
  cx: CallableFunction;
}) {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  if (status === "loading") {
    // Add loading spinner here
    return (
      <>
        <Loader size={"xs"} variant={"dots"} />
      </>
    );
  }

  return user ? (
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
            <Avatar
              src={user.image}
              alt={user.name ?? "User Avatar"}
              radius="xl"
              size={20}
              imageProps={{ referrerPolicy: "no-referrer" }}
            />

            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
              {user.name ?? user.email}
            </Text>

            <IconChevronDown size={12} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {userCan(user, ["users:read"]) && (
          <>
            <Menu.Item
              component={Link}
              href={"/admin/users"}
              icon={<IconUser size={14} stroke={1.5} />}
            >
              Manage Users
            </Menu.Item>

            <Menu.Divider />
          </>
        )}

        <Menu.Item
          component={Link}
          href={"/account"}
          icon={<IconSettings size={14} stroke={1.5} />}
        >
          Account settings
        </Menu.Item>

        <Menu.Item
          onClick={() => {
            signOut();
          }}
          icon={<IconLogout size={14} stroke={1.5} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    <UnstyledButton
      onClick={() => {
        signIn();
      }}
      sx={{ height: 30 }}
    >
      Sign In
    </UnstyledButton>
  );
}
