import { signIn, signOut } from "next-auth/react";
import {
  IconChevronDown,
  IconSettings,
  IconLogout,
  IconUser,
  IconLogin,
} from "@tabler/icons";
import { userCan } from "../lib/services/PermissionService";
import {
  Menu,
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Button,
} from "@mantine/core";
import Link from "next/link";
import { Session } from "next-auth";

export default function UserButton({
  classes,
  cx,
  onClick,
  session = null,
}: {
  classes: any;
  cx: CallableFunction;
  onClick: () => void;
  session: Session | null;
}) {
  const user = session?.user;

  return user ? (
    <Menu width={260} trigger="hover" transition="pop-top-right">
      <Menu.Target>
        <UnstyledButton className={cx(classes.user)}>
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
              onClick={onClick}
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
          onClick={onClick}
        >
          Account settings
        </Menu.Item>

        <Menu.Item
          onClick={() => {
            onClick();
            signOut();
          }}
          icon={<IconLogout size={14} stroke={1.5} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    <Button
      leftIcon={<IconLogin />}
      variant="subtle"
      className={classes.user}
      onClick={() => {
        onClick();
        signIn();
      }}
      sx={{ height: 30, padding: 0, margin: "4px 0" }}
    >
      Sign In
    </Button>
  );
}
