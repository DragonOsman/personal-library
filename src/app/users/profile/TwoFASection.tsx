"use client";

import { useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { authClient } from "@/src/auth-client";
import { Formik } from "formik";
import { toFormikValidate } from "zod-formik-adapter";
import { passwordField } from "@/src/utils/validation";
import { z } from "zod";

interface TwoFASectionProps {
  enabled: boolean;
}

const TwoFASection = ({ enabled }: TwoFASectionProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [password, setPassword] = useState("");
  const [qrcodeURL, setQrCodeURL] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const verifyTotp = async (code: string) => {
    const verificationResult = await authClient.twoFactor.verifyTotp({
      code,
      trustDevice: true
    });

    if (verificationResult.data) {
      setShowVerification(false);
      setIsEnabled(true);
      alert("2FA verification successful! 2FA is now fully enabled.");
    } else if (verificationResult.error) {
      const { code, message, status, statusText } = verificationResult.error;
      if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
        setError(`Verification failed - Error Code: ${code} - ${message} (${status}: ${statusText})`);
      }
    }
  };

  const toggle2FA = async (enable: boolean) => {
    if (enable) {
      const enableResult = await authClient.twoFactor.enable({
        password,
        issuer: "DragonOsman Personal Library App"
      });

      if (enableResult.data) {
        const { totpURI, backupCodes } = enableResult.data;

        const qrcodeDataURL = await QRCode.toDataURL(totpURI);
        setQrCodeURL(qrcodeDataURL);
        setBackupCodes(backupCodes);
        setShowVerification(true);
        alert("QR code generated. Please scan and verify to complete 2FA setup.");
      } else if (enableResult && enableResult.error) {
        const { code, message, status, statusText } = enableResult.error;
        if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
          setError(`Error Code: ${code} - ${message} (${status}: ${statusText})`);
        }
      }
    } else {
      const disableResult = await authClient.twoFactor.disable({
        password
      });

      if (disableResult.data) {
        const { status } = disableResult.data;
        if (status) {
          setIsEnabled(false);
          alert("2FA disabled successfully");
        } else {
          alert("An unknown error occurred trying to disable 2FA");
        }
      } else if (disableResult.error) {
        const { code, message, status, statusText } = disableResult.error;
        if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
          setError(`Error Code: ${code} - ${message} (${status}: ${statusText})`);
        }
      }
    }
  };

  const totpSchema = z
    .string()
    .length(6, "Must be 6 digits")
    .regex(/^\d{6}$/, "Must contain only digits")
  ;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Two-factor Authentication</h2>
      <p className="text-gray-700">
        2FA is currently <strong>{isEnabled ? "enabled" : "disabled"}</strong>.
      </p>

      <Formik
        initialValues={{ password: "" }}
        validationSchema={toFormikValidate(passwordField)}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          setPassword(values.password);
          setSubmitting(false);
        }}
      >
        {({ handleSubmit, getFieldProps, errors, touched, isSubmitting }) => (
          <div className="TwoFactorAuthContainer w-full max-w-md flex flex-col flex-1 justify-center">
            <form method="post" className="flex flex-col gap-4" onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(event);
              }}>
              <label htmlFor="password">Enter Password:</label>
              <input
                type="password"
                title="Enter Password"
                className="border rounded p-2 w-full"
                {...getFieldProps("password")}
              />
              {touched.password && errors.password && (
                <p className="errors text-red-500 text-sm">{errors.password}</p>
              )}

              <input
                type="submit"
                value="Submit"
                className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-600"
                disabled={isSubmitting}
              />
            </form>
          </div>
        )}
      </Formik>

      <button
        type="button"
        title="toggle 2fa"
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-600"
        onClick={() => toggle2FA(!isEnabled)}
      >
        {isEnabled ? "Disable " : "Enable "}2FA
      </button>
      {error !== "" && (
        <p className="error text-red-500 text-sm">{error}</p>
      )}
      {qrcodeURL !== "" && (
        <div className="space-y-2">
          <h3 className="font-semibold">Scan this QR Code with your authenticator app:</h3>
          <Image
            src={qrcodeURL}
            alt="2FA QR Code"
          />
        </div>
      )}
      {backupCodes.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Save these backup codes securely: </h3>
          <div className="bg-gray-100 p-4 rounded">{
            backupCodes.map((code, index) => (
              <div key={index}>
                <p className="font-mono text-sm">{code}</p>
              </div>
            ))
          }</div>
          <p className="text-sm text-gray-600">
            Store these in a safe place. You can them use them to access your account if you lose your
            authenticator device.
          </p>
        </div>
      )}
      {showVerification && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Verify Your Setup</h3>
          <p className="text-sm text-gray-600">Enter the 6 - digit code from your authenticator app to complete 2 FA setup: </p>
          <Formik
            initialValues={{ totpCode: "" }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              await verifyTotp(values.totpCode);
              setSubmitting(false);
            }}
            validationSchema={toFormikValidate(totpSchema)}
          >
            {({ isSubmitting, handleSubmit, getFieldProps, errors, touched }) => (
              <form
                method="post"
                className="flex flex-col gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit(event);
                }}
              >
                <label htmlFor="code">Enter verification code:</label>
                <input
                  type="text"
                  title="Enter 6-digit code"
                  className="bg-green-500 text-white p-2 rounded disabled:opacity-50 hover:bg-green-600 w-32"
                  maxLength={6}
                  {...getFieldProps("totpCode")}
                />
                {touched.totpCode && errors.totpCode && (
                  <p className="text-sm text-red-500">{errors.totpCode}</p>
                )}

                <input
                  type="submit"
                  title="verify totp"
                  value="Verify"
                  className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-600"
                  disabled={isSubmitting}
                />
              </form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default TwoFASection;
