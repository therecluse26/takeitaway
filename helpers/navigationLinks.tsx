import { Center, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';
import Link from 'next/link';
import { RouterTransition } from '../components/RouterTransition';

export function navigationLinks(
  links: Array<any>,
  classes: any,
  onClick: () => void
) {
  return links.map((link, index) => {
    const menuItems = link.links?.map((item: any) => (
      <Menu.Item key={(item.key ?? item.link) + '_top_' + index}>
        <Link
          onClick={onClick}
          key={(item.key ?? item.label) + '_link_' + index}
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
          key={(link.key ?? link.label) + '_transition_' + index}
        />
        {link?.links?.length > 0 ? (
          <Menu
            key={(link.key ?? link.label) + '_menu_' + index}
            trigger="hover"
            exitTransitionDuration={0}
          >
            <Menu.Target key={(link.key ?? link.label) + '_target_' + index}>
              <Text
                key={(link.key ?? link.label) + '_menu_link_' + index}
                className={classes.link}
              >
                <Center key={(link.key ?? link.label) + '_center_' + index}>
                  <span className={classes.linkLabel} key={'span_' + index}>
                    {link.label}
                  </span>
                  <IconChevronDown
                    size={12}
                    stroke={1.5}
                    key={'chevron' + index}
                  />
                </Center>
              </Text>
            </Menu.Target>

            <Menu.Dropdown
              key={(link.key ?? link.label) + '_dropdown_' + index}
            >
              {menuItems}
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Center>
            <Link
              onClick={onClick}
              key={(link.key ?? link.label) + '_link_' + index}
              href={link.link}
              className={classes.link}
            >
              {link.label}
            </Link>
          </Center>
        )}
      </>
    );
  });
}
