import { Button, Group, Loader, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { Address, AddressType, User } from "@prisma/client";
import { useState } from "react";
import { submitAddress } from "../../lib/services/AddressService";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";
import { useSessionUser } from "../../lib/services/UserService";

export default function AddressForm({
  type,
  onSubmitted,
  onCanceled = () => {},
  user = null,
  address = null,
}: {
  type: AddressType;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onSubmitted: (address: Address) => void;
  onCanceled: () => void;
  user: User | UserWithRelations | null;
  address?: Address | null;
}) {
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const authUser = useSessionUser();
  const formUser = user ? user : authUser;

  const form = useForm({
    initialValues: {
      id: address?.id ?? null,
      type: type,
      userId: formUser.id,
      street: address?.street ?? "",
      street2: address?.street2 ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "AZ",
      zip: address?.zip ?? "",
      country: address?.country ?? "US",
    } as Address,

    validate: {
      type: isNotEmpty("Address type is required"),
      userId: isNotEmpty("User ID is required"),
      street: isNotEmpty("Street address is required"),
      city: isNotEmpty("City is required"),
      state: isNotEmpty("State is required"),
      zip: isNotEmpty("Zip code is required"),
      country: isNotEmpty("Country is required"),
    },
  });

  const submitForm = async (values: any) => {
    setLoading(true);
    await submitAddress(values)
      .then((address: Address) => {
        onSubmitted(address);
      })
      .catch((e) => {
        console.error(e);
        setErrored(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <Loader m={"1rem"} />
      ) : (
        <>
          {errored ? (
            <div className="text-red-500 text-sm">
              There was an error submitting your address. Please try again.
            </div>
          ) : (
            <form onSubmit={form.onSubmit((values) => submitForm(values))}>
              <TextInput hidden {...form.getInputProps("id")} />
              <TextInput
                label="Street Address"
                placeholder="123 Main St"
                withAsterisk
                {...form.getInputProps("street")}
              />
              <TextInput
                label="Secondary Address"
                placeholder="PO Box 456"
                {...form.getInputProps("street2")}
              />
              <TextInput
                label="City"
                placeholder="Phoenix"
                withAsterisk
                {...form.getInputProps("city")}
              />
              <TextInput
                label="State"
                placeholder="AZ"
                disabled
                {...form.getInputProps("state")}
              />
              <TextInput
                label="Zip"
                placeholder="85001"
                withAsterisk
                {...form.getInputProps("zip")}
              />
              <TextInput
                label="Country"
                placeholder="US"
                disabled
                {...form.getInputProps("country")}
              />
              <Group>
                <Button type="submit" variant="outline" color="blue" mt="md">
                  Save
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  mt="md"
                  onClick={() => {
                    onCanceled();
                  }}
                >
                  Cancel
                </Button>
              </Group>
            </form>
          )}
        </>
      )}
    </>
  );
}
