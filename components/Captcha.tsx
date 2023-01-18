import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { showNotification } from "@mantine/notifications";
import { companyInfo } from "../data/messaging";

const Divider = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Divider)
);

const HCaptcha = dynamic(() => import("@hcaptcha/react-hcaptcha"));

export interface CaptchaProps {
  onInitializationError: () => any;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onToken: (token: string | undefined | null) => void;
}

const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

export const Captcha: React.FunctionComponent<CaptchaProps> = ({
  onInitializationError,
  onToken,
}) => {
  const [initializedError, setInitializedError] = useState<boolean>(false);

  useEffect(() => {
    if (!hcaptchaSiteKey) {
      onInitializationError();
      setInitializedError(true);
    }
  }, [onInitializationError]);

  return (
    <>
      {!initializedError && (
        <div>
          <Divider size={0} style={{ marginBottom: "1rem" }} />

          {hcaptchaSiteKey ? (
            <HCaptcha
              sitekey={hcaptchaSiteKey}
              onVerify={onToken}
              onExpire={() => onToken(null)}
              onError={() => {
                onToken(null);
                showNotification({
                  title: "Error",
                  message: "Cannot verify captcha",
                });
              }}
            />
          ) : (
            <>
              Captcha configuration is broken. Please contact us at{" "}
              {companyInfo.phoneNumber}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Captcha;
