import React from "react";
import { showNotification } from "@mantine/notifications";
import dynamic from "next/dynamic";

const Divider = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Divider)
);

const HCaptcha = dynamic(() => import("@hcaptcha/react-hcaptcha"));

export interface CaptchaProps {
  show: boolean;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onToken: (token: string) => void;
}

const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";
const env = process.env.NODE_ENV;

export const Captcha: React.FunctionComponent<CaptchaProps> = ({
  show,
  onToken,
}) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <Divider size={0} style={{ marginBottom: "1rem" }} />
      <HCaptcha
        sitekey={
          env === "development"
            ? "10000000-ffff-ffff-ffff-000000000001"
            : hcaptchaSiteKey
        }
        onVerify={onToken}
        onExpire={() => onToken("")}
        onError={(err) => {
          onToken("");
          showNotification({
            title: "Error",
            message: "Cannot verify captcha",
          });
          console.error(err);
        }}
      />
    </>
  );
};

export default Captcha;
