import {
  Button,
  Center,
  Group,
  Loader,
  Menu,
  Modal,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "@prisma/client";
import { IconLogin, IconShoppingCart, IconTrashOff } from "@tabler/icons";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { CartItem } from "../../lib/services/CheckoutService";
import { redirectToCheckout } from "../../lib/services/StripeService";
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
  const [cartOpened, { close: closeCartSetter, open: openCartSetter }] =
    useDisclosure(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [dialogOpened, { close: closeDialog, open: openDialog }] =
    useDisclosure(false);
  const [clearCartConfirmed, setClearCartConfirmed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
  }, [clearCartConfirmed, closeDialog]);

  function getShoppingCartTotal() {
    const cartItems = getCartItems();
    if (cartItems.length > 0) {
      let total = 0;
      cartItems.forEach((item: CartItem) => {
        total += item.service.price;
      });
      setCartTotal(total);
      return total;
    }

    setCartTotal(0);
    return 0;
  }

  const cartUpdatedCallback = useCallback(() => {
    const tot = getShoppingCartTotal();
    if (tot > 0) {
      openCartSetter();
    }
  }, [openCartSetter]);

  useEffect(() => {
    window.addEventListener("cartUpdated", cartUpdatedCallback);
    getShoppingCartTotal();
    return () => {
      window.removeEventListener("cartUpdated", cartUpdatedCallback);
    };
  }, [cartUpdatedCallback]);

  return (
    <>
      {checkoutLoading ? (
        <Loader size="sm" />
      ) : (
        <>
          <Menu
            trigger="hover"
            opened={cartOpened}
            onOpen={openCartSetter}
            onClose={closeCartSetter}
          >
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
                    <Menu.Item
                      icon={<IconShoppingCart />}
                      color={"blue"}
                      onClick={async () => {
                        setCheckoutLoading(true);
                        await redirectToCheckout(
                          "subscription",
                          new URL(
                            window.location.origin + `/subscriptions/save`
                          ),
                          new URL(window.location.href),
                          getCartItems()
                        );
                        setCheckoutLoading(false);
                      }}
                    >
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
      )}
    </>
  );
}
