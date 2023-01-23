import { Button, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { Address, AddressType, User } from "@prisma/client";
import { useState } from "react";
import { submitAddress } from "../../lib/services/AddressService";
import { UserWithRelations } from "../../lib/services/api/ApiUserService";
import { useSessionUser } from "../../lib/services/UserService";

export default function AddressForm({
  type,
  onSubmitted,
  user = null,
}: {
  type: AddressType;
  onSubmitted: (address: Address) => void;
  user: User | UserWithRelations | null;
}) {
  const [errored, setErrored] = useState(false);
  const authUser = useSessionUser();
  const formUser = user ? user : authUser;

  const form = useForm({
    initialValues: {
      type: type,
      userId: formUser.id,
      street: "",
      city: "",
      state: "AZ",
      zip: "",
      country: "US",
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
    await submitAddress(values)
      .then((address: Address) => {
        onSubmitted(address);
      })
      .catch((e) => {
        console.error(e);
        setErrored(true);
      });
  };

  return (
    <>
      {errored ? (
        <div className="text-red-500 text-sm">
          There was an error submitting your address. Please try again.
        </div>
      ) : (
        <form onSubmit={form.onSubmit((values) => submitForm(values))}>
          <TextInput
            label="Street"
            placeholder="123 Main St"
            withAsterisk
            {...form.getInputProps("street")}
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
          <Button type="submit" variant="outline" color="blue" mt="md">
            Save
          </Button>
        </form>
      )}
    </>
  );
}
