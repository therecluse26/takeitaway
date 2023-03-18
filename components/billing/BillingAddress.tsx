import { Title, Button, Center, Container } from "@mantine/core";
import { Address, User } from "@prisma/client";
import { useState } from "react";
import { formatAddress } from "../../lib/services/AddressService";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";
import AddressForm from "../locations/AddressForm";

export default function BillingAddress({
  billingaddress,
  setBillingAddress,
  user,
  center = false,
}: {
  billingaddress: Address | null;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setBillingAddress: (address: Address) => void;
  user: User | UserWithRelations | null;
  center?: boolean;
}) {
  const [editingBillingaddress, setEditingBillingAddress] =
    useState<boolean>(false);

  return (
    <Container mt="2rem">
      {center ? (
        <Center>
          <Title order={4}>Billing Address</Title>
        </Center>
      ) : (
        <Title order={4}>Billing Address</Title>
      )}

      {billingaddress && !editingBillingaddress ? (
        <>
          {center ? (
            <Center>
              {formatAddress(billingaddress)}{" "}
              <Button
                variant="subtle"
                onClick={() => {
                  setEditingBillingAddress(true);
                }}
              >
                Edit
              </Button>
            </Center>
          ) : (
            <>
              {formatAddress(billingaddress)}{" "}
              <Button
                variant="subtle"
                onClick={() => {
                  setEditingBillingAddress(true);
                }}
              >
                Edit
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <AddressForm
            address={billingaddress}
            user={user}
            onCanceled={() => {
              setEditingBillingAddress(false);
            }}
            onSubmitted={(address: Address) => {
              setBillingAddress(address);
              setEditingBillingAddress(false);
            }}
            type="billing"
          />
        </>
      )}
    </Container>
  );
}
