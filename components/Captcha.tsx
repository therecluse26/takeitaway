import React from "react";
import dynamic from "next/dynamic";
import { showNotification } from "@mantine/notifications";

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
        sitekey={hcaptchaSiteKey}
        onVerify={onToken}
        onExpire={() => onToken("")}
        onError={() => {
          onToken("");
          showNotification({
            title: "Error",
            message: "Cannot verify captcha",
          });
        }}
      />
    </>
  );
};

export default Captcha;
