import { betterAuth } from "better-auth";
import prisma from "./app/lib/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, twoFactor, emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createTransport } from "nodemailer";

const emailServerHost = process.env.EMAIL_SERVER_HOST || "";
const emailServerPort = process.env.EMAIL_SERVER_PORT
  ? parseInt(process.env.EMAIL_SERVER_PORT)
  : 0;
const emailServerUser = process.env.EMAIL_SERVER_USER || "";
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD || "";
const emailFrom = process.env.EMAIL_FROM || "";
const baseURL = process.env.BETTER_AUTH_URL || "";

async function sendEmail(options: {
  to: string,
  subject: string,
  text: string
}): Promise<void> {
  const transport = createTransport({
    host: emailServerHost,
    port: emailServerPort,
    secure: emailServerPort === 465
  });
  await transport.sendMail({
    from: emailFrom,
    to: options.to,
    subject: options.subject,
    text: options.text
  });
}

export const auth = betterAuth({
  baseURL,
  user: {
    changeEmail: {
      enabled: true
    },
    additionalFields: {
      alternateEmails: {
        type: "string[]",
        required: false,
        nullable: true,
        default: null,
        input: true
      }
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click here to verify your email: ${url}`
      });
    },
    sendOnSignIn: true,
    requireVerifiedEmail: true
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  advanced: {
    database: {
      generateId: "uuid"
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    },
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
      updateUserInfoOnLink: true
    }
  },
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        const transport = createTransport({
          host: emailServerHost,
          port: emailServerPort,
          secure: emailServerPort === 465,
          auth: {
            user: emailServerUser,
            pass: emailServerPassword
          }
        });
        const info = await transport.sendMail({
          from: emailFrom,
          to: email,
          subject: "Your Magic Sign-In Link",
          text: `Click the link to sign in: ${url}\n\nOr enter this token: ${token}`,
          html: `<p>Click the link to sign in: <a href="${url}">${url}</a></p><p>Or enter this token: <strong>${token}</strong></p>`
        });
        console.log("Magic link email sent: %s", info.messageId);
      }
    }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendEmail({
            to: user.email,
            subject: "Your 2FA Code",
            text: `Your verification code is: ${otp}`
          });
        }
      }
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const transport = createTransport({
          host: emailServerHost,
          port: emailServerPort,
          secure: emailServerPort === 456,
          auth: {
            user: emailServerUser,
            pass: emailServerPassword
          }
        });

        let subject = "";
        if (type === "sign-in") {
          subject = "Your sign-in code";
        } else if (type === "forget-password") {
          subject = "Your password reset code";
        } else if (type === "email-verification") {
          subject = "Your verifiction code";
        }
        const text = `${subject} is: ${otp}.`;

        await transport.sendMail({
          from: emailFrom,
          to: email,
          subject,
          text
        });
      }
    })
  ]
});
