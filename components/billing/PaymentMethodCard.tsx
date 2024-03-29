import { IconCheck } from "@tabler/icons";
import dynamic from "next/dynamic";
import { JSXElementConstructor, useState } from "react";
import { setPaymentMethodAsDefault } from "../../lib/services/UserService";
import { getIconForBrand } from "../../lib/utils/icon-helpers";
import { PaymentMethod, User } from "@prisma/client";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";
import { notify, notifyError } from "../../helpers/notify";

const Center = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);
const Button = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Button as JSXElementConstructor<any>
  )
);
const ThemeIcon = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.ThemeIcon as JSXElementConstructor<any>
  )
);
const Card = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Card as JSXElementConstructor<any>)
);
const Group = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Group as JSXElementConstructor<any>)
);
const Text = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Text as JSXElementConstructor<any>)
);
const Loader = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Loader as JSXElementConstructor<any>
  )
);
const Stack = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Stack as JSXElementConstructor<any>)
);

const PaymentMethodCard = ({
  paymentMethod,
  user,
  refreshCallback,
}: {
  paymentMethod: PaymentMethod;
  user: User | UserWithRelations;
  refreshCallback: () => void;
}) => {
  const [makeDefaultLoading, setMakeDefaultLoading] = useState(false);

  const handleSetDefault = async (paymentMethod: PaymentMethod) => {
    setMakeDefaultLoading(true);
    setPaymentMethodAsDefault(user, paymentMethod)
      .then(() => {
        notify("Payment method set as default");
      })
      .catch(() => {
        notifyError(500, "api", "Unable to set payment method as default");
      })
      .finally(() => {
        setMakeDefaultLoading(false);
        refreshCallback();
      });
  };

  return (
    <Center>
      <Card key={paymentMethod.id} withBorder={true} radius="lg" shadow="sm">
        <Group>
          {getIconForBrand(paymentMethod.brand, 74, 74)}
          <Stack spacing={1}>
            <div>Ending in {paymentMethod.last4}</div>
            <div>
              Exp.{" "}
              <b>
                {paymentMethod.expMonth} / {paymentMethod.expYear}
              </b>
            </div>
          </Stack>
          <div>
            {paymentMethod.default ? (
              <Group
                spacing="12"
                sx={() => ({
                  padding: "14px",
                })}
              >
                <ThemeIcon variant="subtle" size="xs">
                  <IconCheck />
                </ThemeIcon>{" "}
                <Text size="xs">Default</Text>
              </Group>
            ) : (
              <>
                {makeDefaultLoading ? (
                  <Loader size="xs"></Loader>
                ) : (
                  <>
                    {/* Button to set payment method as default */}
                    <Button
                      variant={"subtle"}
                      size="xs"
                      onClick={() => {
                        handleSetDefault(paymentMethod);
                      }}
                    >
                      Make Default
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </Group>
      </Card>
    </Center>
  );
};

export default PaymentMethodCard;
