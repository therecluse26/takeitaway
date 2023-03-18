import {
  ActionIcon,
  Button,
  Center,
  Group,
  Indicator,
  Loader,
  Menu,
  Modal,
  NumberInput,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure, useFocusWithin } from "@mantine/hooks";
import { IconLogin, IconShoppingCart, IconTrashOff } from "@tabler/icons";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import {
  CartItem,
  getCartItems,
  removeServiceFromCart,
  updateServiceQuantity,
} from "../../lib/services/CheckoutService";
import { redirectToCheckout } from "../../lib/services/StripeService";
import { formatAmountForDisplay } from "../../lib/utils/stripe-helpers";

function buildCartItems() {
  const minQuantity = 1;
  const maxQuantity = 99;

  return getCartItems().map((item: CartItem) => (
    <Menu.Item key={"menu_item_" + item.service.id}>
      <Stack>
        <Center>
          <Text key={item.service.id}>
            {item.service.name} - {formatAmountForDisplay(item.service.price)}
          </Text>
        </Center>
        <Center>
          <Group spacing={2}>
            <ActionIcon
              size={"md"}
              variant="default"
              onClick={() => {
                if (item.quantity > minQuantity) {
                  updateServiceQuantity(item.service, item.quantity - 1);
                }
              }}
            >
              –
            </ActionIcon>

            <NumberInput
              hideControls
              value={item.quantity}
              onChange={(val) => {
                updateServiceQuantity(item.service, val ?? 1);
              }}
              max={maxQuantity}
              min={minQuantity}
              step={1}
              size={"xs"}
              styles={{ input: { width: 54, textAlign: "center" } }}
            />

            <ActionIcon
              size={"md"}
              variant="default"
              onClick={() => {
                if (item.quantity < maxQuantity) {
                  updateServiceQuantity(item.service, item.quantity + 1);
                }
              }}
            >
              +
            </ActionIcon>
          </Group>
        </Center>
        <Center>
          <Button
            onClick={() => {
              removeServiceFromCart(item.service);
            }}
            size="xs"
            variant="outline"
            color="red"
          >
            Remove
          </Button>
        </Center>
      </Stack>
    </Menu.Item>
  ));
}

function sumCartItemQuantity() {
  return getCartItems().reduce((acc, item) => acc + item.quantity, 0);
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
  const { ref, focused } = useFocusWithin();

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
        total += item.service.price * item.quantity;
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
        <div ref={ref}>
          <Menu
            trigger="hover"
            opened={cartOpened}
            onOpen={openCartSetter}
            onClose={() => {
              if (!focused) {
                closeCartSetter();
              }
            }}
          >
            <Menu.Target>
              {sumCartItemQuantity() > 0 ? (
                <Indicator
                  inline
                  size={20}
                  color={"red"}
                  label={sumCartItemQuantity()}
                >
                  <Button variant="subtle">
                    <IconShoppingCart /> <Space mr="sm" />{" "}
                    {formatAmountForDisplay(cartTotal)}
                  </Button>
                </Indicator>
              ) : (
                <Button variant="subtle">
                  <IconShoppingCart /> <Space mr="sm" />{" "}
                  {formatAmountForDisplay(cartTotal)}
                </Button>
              )}
            </Menu.Target>
            <Menu.Dropdown>
              {getCartItems().length > 0 ? (
                <>{buildCartItems()}</>
              ) : (
                <Text>Cart is empty</Text>
              )}
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
        </div>
      )}
    </>
  );
}
