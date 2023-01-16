import React, { useEffect, useState } from "react";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { JSXElementConstructor } from "react";
import Captcha from "../Captcha";
import { submitMessage } from "../../lib/services/ContactService";
import { companyInfo, errorMessages, pageMessages } from "../../data/messaging";

const TextInput = dynamic(() =>
  import("@mantine/core").then((mod) => mod.TextInput)
);
const Checkbox = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Checkbox)
);
const Button = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Button as JSXElementConstructor<any>
  )
);
const Group = dynamic(() => import("@mantine/core").then((mod) => mod.Group));
const Box = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Box as JSXElementConstructor<any>)
);
const Textarea = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Textarea)
);
const Title = dynamic(() => import("@mantine/core").then((mod) => mod.Title));

const Center = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);

const ContactUsForm: JSXElementConstructor<any> = () => {
  const { data: session, status } = useSession();
  const [nameDisabled, setNameDisabled] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [initializedError, setInitializedError] = useState(false);
  const [errored, setErrored] = useState(false);
  const handleCaptchaToken = (token: string | undefined | null) => {
    try {
      if (token) {
        setCaptchaToken(token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      message: "",
      termsOfService: false,
      "h-captcha-response": "",
    },

    validate: {
      name: isNotEmpty("Name is required"),
      email: isEmail("Invalid email"),
      phone: (value) =>
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value) ||
        value.length === 0
          ? null
          : "Invalid phone number",
      message: hasLength(
        { min: 5, max: 2000 },
        "Message is required and must be no longer than 2000 characters"
      ),
      termsOfService: (value) => (value ? null : "You must agree to the terms"),
      "h-captcha-response": (value) =>
        value.length > 0 ? null : "Captcha is required",
    },
  });

  const submitForm = async (values: any) => {
    submitMessage(values)
      .then(() => {
        setSubmitted(true);
      })
      .catch((e) => {
        console.error(e);
        setErrored(true);
      });
  };

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      form.setValues({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      });
      setNameDisabled(true);
      setEmailDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  useEffect(() => {
    if (captchaToken) {
      form.setValues({ "h-captcha-response": captchaToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  if (errored) {
    return (
      <Center>
        <Title order={3}>{errorMessages.form.failedToSubmit.message}</Title>
      </Center>
    );
  }

  if (initializedError) {
    return (
      <Center>
        <Title order={3}>{errorMessages.form.failedToInitialize.message}</Title>
      </Center>
    );
  }

  return (
    <>
      {submitted ? (
        <Center>
          <Title order={3}>{pageMessages.contactUs.messages.submitted}</Title>
        </Center>
      ) : (
        <Box sx={{ maxWidth: 600 }} mx="auto">
          <Title>{pageMessages.contactUs.title}</Title>
          <p>Phone: {companyInfo.phoneNumber}</p>

          <form onSubmit={form.onSubmit((values) => submitForm(values))}>
            <TextInput
              withAsterisk
              label="Full Name"
              placeholder="Name"
              disabled={nameDisabled}
              {...form.getInputProps("name")}
            />

            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              disabled={emailDisabled}
              {...form.getInputProps("email")}
            />

            <TextInput
              label="Phone"
              placeholder="Phone"
              {...form.getInputProps("phone")}
            />

            <TextInput
              label="City"
              placeholder="City"
              {...form.getInputProps("city")}
            />

            <Textarea
              withAsterisk
              label="Message"
              placeholder="Message"
              rows={10}
              {...form.getInputProps("message")}
            />

            <Captcha
              show={true}
              onInitializationError={() => {
                setInitializedError(true);
              }}
              onToken={handleCaptchaToken}
              {...form.getInputProps("captchaToken")}
            ></Captcha>

            <Checkbox
              mt="md"
              label="By using this form you agree with the storage and handling of your data by this website."
              {...form.getInputProps("termsOfService")}
            />

            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      )}
    </>
  );
};

export default ContactUsForm;
