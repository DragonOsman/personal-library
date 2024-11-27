import { ReactElement } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Email {
  to: string[];
  subject: string;
  react: ReactElement;
}

export const sendEmail = async (payload: Email) => {
  const { error } = await resend.emails.send({
    from: "DragonOsman's Personal Library <osman@osmanzakir.dynu.net>",
    ...payload
  });

  if (error) {
    console.log(`Error sending email: ${error}`);
    return null;
  }

  console.log("Email sent successfully");
  return true;
};