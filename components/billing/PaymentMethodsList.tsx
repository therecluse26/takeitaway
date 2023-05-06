import { Grid } from "@mantine/core";
import dynamic from "next/dynamic";
import { JSXElementConstructor, useEffect, useState } from "react";
import { redirectToCheckout } from "../../lib/services/StripeService";
import { PaymentMethod, User } from "@prisma/client";
import PaymentMethodCard from "./PaymentMethodCard";
import { getUserPaymentMethods } from "../../lib/services/UserService";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";

const Button = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Button as JSXElementConstructor<any>
  )
);
const Space = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Space as JSXElementConstructor<any>)
);
const Center = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);
const Loader = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Loader as JSXElementConstructor<any>
  )
);

const PaymentMethodsList = ({
  user,
  checkout = false,
}: {
  user: User | UserWithRelations;
  checkout?: boolean;
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(
    null
  );
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [loadingAddPaymentMethod, setLoadingAddPaymentMethod] = useState(false);

  useEffect(() => {
    if (user.id && paymentMethods === null) {
      setLoadingPaymentMethods(true);
      getUserPaymentMethods(user.id)
        .then((data) => {
          setPaymentMethods(data);
        })
        .finally(() => {
          setLoadingPaymentMethods(false);
        });
    }
  }, [user, paymentMethods]);

  const refreshMethods = () => {
    setPaymentMethods(null);
  };

  return (
    <>
      {loadingPaymentMethods ? (
        <>
          <Space h={"lg"} />
          <Center>
            <Loader />
          </Center>
        </>
      ) : (
        <>
          <Center>
            <h2>Payment Methods</h2>
          </Center>
          <Grid gutter="lg">
            {paymentMethods &&
              paymentMethods.map((paymentMethod) => (
                <Grid.Col key={paymentMethod.id} md={6} lg={4}>
                  <PaymentMethodCard
                    refreshCallback={refreshMethods}
                    user={user}
                    paymentMethod={paymentMethod}
                  />
                </Grid.Col>
              ))}
          </Grid>

          <Space h="lg"></Space>

          <Center>
            {/* This is the button that redirects to Stripe Checkout to add a new payment method */}
            <Button
              onClick={() => {
                setLoadingAddPaymentMethod(true);

                let saveUrl = new URL(
                  window.location.origin + `/account/save-payment-method`
                );

                if (checkout) {
                  const searchParams = new URLSearchParams(saveUrl.search);
                  searchParams.set("checkout", "true");
                  saveUrl.search = searchParams.toString();
                }

                redirectToCheckout(
                  "setup",
                  saveUrl,
                  new URL(window.location.href)
                );
              }}
            >
              {loadingAddPaymentMethod ? (
                <Loader size={"sm"} m={"1rem"} color="white" />
              ) : (
                "New Payment Method"
              )}
            </Button>
          </Center>
        </>
      )}
    </>
  );
};

export default PaymentMethodsList;
