import { Center, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';
import Link from 'next/link';
import { RouterTransition } from '../components/RouterTransition';
import { NavbarLink } from '../data/navbar-links';

export default function NavigationLinks({
  links,
  classes,
  onClick,
  type = null,
}: {
  links: NavbarLink[];
  classes: any;
  onClick: () => void;
  type?: string | null;
}) {
  return (
    <>
      {links.map((link, index) => {
        return (
          <>
            <RouterTransition
              key={(link.key ?? link.label) + '_transition_' + index + type}
            />
            {link?.links && link?.links?.length > 0 ? (
              <Menu
                key={(link.key ?? link.label) + '_menu_' + index + type}
                trigger="hover"
                exitTransitionDuration={0}
              >
                <Menu.Target
                  key={(link.key ?? link.label) + '_target_' + index + type}
                >
                  <Text
                    key={
                      (link.key ?? link.label) + '_menu_link_' + index + type
                    }
                    className={classes.link}
                  >
                    <Center
                      key={(link.key ?? link.label) + '_center_' + index + type}
                    >
                      <span
                        className={classes.linkLabel}
                        key={'span_' + index + type}
                      >
                        {link.label}
                      </span>
                      <IconChevronDown
                        size={12}
                        stroke={1.5}
                        key={'chevron' + index + type}
                      />
                    </Center>
                  </Text>
                </Menu.Target>

                <Menu.Dropdown
                  key={(link.key ?? link.label) + '_dropdown_' + index + type}
                >
                  {link.links?.map((item: any) => (
                    <Menu.Item
                      key={(item.key ?? item.link) + '_top_' + index + type}
                    >
                      <Link
                        onClick={onClick}
                        key={(item.key ?? item.label) + '_link_' + index + type}
                        href={item.link}
                        className={classes.link}
                      >
                        {item.label}
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Center>
                <Link
                  onClick={onClick}
                  key={(link.key ?? link.label) + '_link_' + index + type}
                  href={link.link}
                  className={classes.link}
                >
                  {link.label}
                </Link>
              </Center>
            )}
          </>
        );
      })}
    </>
  );
}
