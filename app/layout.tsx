import * as React from "react";
import type { Metadata } from "next";
import Header from "@/app/header/Header";
import { SessionProvider} from "next-auth/react";
import { FormikProvider, useFormik, FormikValues } from "formik";
import { registrationSchema } from "@/app/lib/definitions";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "DragonOsman Personal Library",
    template: "%s | DragonOsman Personal Library"
  },
  description: "Personal library app: manage a list of books you've read and/or have",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: async (values: FormikValues) => {
      for (const [key, value] of Object.keys(values)) {
        console.log(`${key}:${value}`);
      }
    },
    validate: () => registrationSchema
  });

  return (
    <html lang="en-us">
      <body>
        <SessionProvider>
          <FormikProvider value={formik}>
            <Header />
            <main>{children}</main>
          </FormikProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
