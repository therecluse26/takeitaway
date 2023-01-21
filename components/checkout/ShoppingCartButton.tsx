import {
  Button,
  Center,
  Group,
  Menu,
  Modal,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEraser,
  IconLogin,
  IconShoppingCart,
  IconTrashOff,
} from "@tabler/icons";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { CartItem } from "../../lib/services/CheckoutService";
import { formatAmountForDisplay } from "../../lib/utils/stripe-helpers";

function getCartItems() {
  const cart = localStorage.getItem("cart");
  if (cart) {
    return JSON.parse(cart);
  }
  return [];
}

function buildCartItems() {
  return getCartItems().map((item: CartItem) => (
    <Text key={item.service.id}>
      {item.service.name} - {formatAmountForDisplay(item.service.price)}
    </Text>
  ));
}

export default function ShoppingCartButton({
  session = null,
}: {
  session: Session | null;
}) {
  const [cartTotal, setCartTotal] = useState(0);
  const [dialogOpened, { close: closeDialog, open: openDialog }] =
    useDisclosure(false);
  const [clearCartConfirmed, setClearCartConfirmed] = useState(false);

  function clearCart() {
    openDialog();
  }

  useEffect(() => {
    if (clearCartConfirmed) {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      closeDialog();
      setClearCartConfirmed(false);
    }
  }, [clearCartConfirmed]);

  function getShoppingCartTotal() {
    const cartItems = getCartItems();
    if (cartItems.length > 0) {
      let total = 0;
      cartItems.forEach((item: CartItem) => {
        total += item.service.price;
      });
      return setCartTotal(total);
    }

    return setCartTotal(0);
  }

  useEffect(() => {
    window.addEventListener("cartUpdated", getShoppingCartTotal);
    getShoppingCartTotal();
    return () => {
      window.removeEventListener("cartUpdated", getShoppingCartTotal);
    };
  }, []);

  return (
    <>
      <Menu trigger="hover">
        <Menu.Target>
          <Button variant="subtle">
            <IconShoppingCart /> <Space mr="sm" />{" "}
            {formatAmountForDisplay(cartTotal)}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Stack>
              {getCartItems().length > 0 ? (
                <>{buildCartItems()}</>
              ) : (
                <Text>Cart is empty</Text>
              )}
            </Stack>
          </Menu.Item>
          {getCartItems().length > 0 ? (
            <>
              {session ? (
                <Menu.Item icon={<IconShoppingCart />} color={"blue"}>
                  Checkout
                </Menu.Item>
              ) : (
                <Menu.Item
                  color={"blue"}
                  icon={<IconLogin />}
                  onClick={() => {
                    signIn();
                  }}
                >
                  Sign in to checkout
                </Menu.Item>
              )}
              <Menu.Item
                icon={<IconTrashOff />}
                color="red"
                onClick={clearCart}
              >
                Clear Cart
              </Menu.Item>
            </>
          ) : null}
        </Menu.Dropdown>
      </Menu>

      <Modal
        onClose={closeDialog}
        opened={dialogOpened}
        withCloseButton={false}
        size="auto"
        centered
      >
        <Text>Are you sure you want to clear your cart?</Text>
        <Center>
          <Group mt={"lg"}>
            <Button onClick={() => setClearCartConfirmed(true)}>Yes</Button>
            <Button onClick={closeDialog} color="red">
              No
            </Button>
          </Group>
        </Center>
      </Modal>
    </>
  );
}
