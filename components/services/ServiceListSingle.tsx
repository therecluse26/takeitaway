import { Button, Grid, Title, Text, Divider } from "@mantine/core";
import { Service } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  CartItem,
  removeServiceFromCart,
  saveServiceToCart,
} from "../../lib/services/CheckoutService";
import { formatAmountForDisplay } from "../../lib/utils/stripe-helpers";

function getCartItems() {
  const cart = localStorage.getItem("cart");
  if (cart) {
    return JSON.parse(cart);
  }
  return [];
}

function getItem(service: Service) {
  const cartItems = getCartItems();
  return cartItems.find((item: CartItem) => item.service.id === service.id);
}

export default function ServiceListSingle({ service }: { service: Service }) {
  const [refresh, setRefresh] = useState(false);

  const refreshButtons = () => {
    setRefresh(!refresh);
  };

  function itemIsInCart(service: Service) {
    return getItem(service) !== undefined;
  }

  useEffect(() => {
    window.addEventListener("cartUpdated", refreshButtons);
    return () => {
      window.removeEventListener("cartUpdated", refreshButtons);
    };
  }, [refresh]);

  return (
    <>
      <Grid gutter={"xs"}>
        <Grid.Col md={4} sm={4}>
          <Image
            src={service.productPhoto}
            alt={service.name}
            width={340}
            height={340}
          />
        </Grid.Col>
        <Grid.Col md={8} sm={8}>
          <Title order={4} mb="xs">
            {service.name}
          </Title>
          <Text size="lg" mb={"1rem"}>
            {formatAmountForDisplay(service.price)} / month
          </Text>
          <Text
            color="dimmed"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />

          {itemIsInCart(service) ? (
            <Button
              onClick={() => {
                removeServiceFromCart(service);
                refreshButtons();
              }}
              variant="filled"
              color="red"
              mt="md"
              radius="md"
            >
              Remove from Cart
            </Button>
          ) : (
            <Button
              onClick={() => {
                saveServiceToCart(service);
                refreshButtons();
              }}
              variant="filled"
              color="blue"
              mt="md"
              radius="md"
            >
              Sign up now
            </Button>
          )}
        </Grid.Col>
      </Grid>
      <Divider m={30} />
    </>
  );
}
