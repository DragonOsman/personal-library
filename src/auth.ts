import { betterAuth } from "better-auth";
import prisma from "./app/lib/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, twoFactor, emailOTP } from "better-auth/plugins";
import { createTransport } from "nodemailer";

const emailServerHost = process.env.EMAIL_SERVER_HOST || "";
const emailServerPort = process.env.EMAIL_SERVER_PORT
  ? parseInt(process.env.EMAIL_SERVER_PORT)
  : 0;
const emailServerUser = process.env.EMAIL_SERVER_USER || "";
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD || "";
const emailFrom = process.env.EMAIL_FROM || "";

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
  database: {
    provider: "postgresql",
    client: prisma,
    adapter: prismaAdapter(prisma, {
      provider: "postgresql",
      usePlural: true,
      transaction: true
    }),
    clientOptions: {
      logger: {
        log: (level: number, message: string) => {
          console.log(`[BetterAuth][${level}] ${message}`);
        },
        minLevel: 2,
        maxLevel: 4
      },
      schema: "public",
      schemaFilePath: "prisma/schema.prisma"
    }
  },
  emailAndPassword: {
    enabled: true,
    changePasswordTokenLength: 32,
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
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        const transport = createTransport({
          host: emailServerHost,
          port: emailServerPort,
          secure: emailServerPort === 465,
          auth: {
            user: emailServerUser,
            pass: emailServerPassword
          }
        });
        const linkWithToken = `${url}?token=${encodeURIComponent(token)}`;
        const info = await transport.sendMail({
          from: emailFrom,
          to: email,
          subject: "Your Magic Sign-In Link",
          text: `Click the link to sign in: ${linkWithToken}\n\nOr enter this token: ${token}`,
          html: `<p>Click the link to sign in: <a href="${linkWithToken}">${linkWithToken}</a></p><p>Or enter this token: <strong>${token}</strong></p>`
        });
        console.log("Magic link email sent: %s", info.messageId);
      }
    }),
    twoFactor(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
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
            subject: "Your One-Time Password (OTP)",
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <strong>${otp}</strong></p>`
          });
          console.log("OTP email sent: %s", info.messageId);
        } else if (type === "email-verification") {
          // Handle email verification OTP if needed
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
            subject: "Your Email Verification OTP",
            text: `Your email verification OTP is: ${otp}`,
            html: `<p>Your email verification OTP is: <strong>${otp}</strong></p>`
          });
          console.log("Email verification OTP sent: %s", info.messageId);
        } else if (type === "forget-password") {
          // Handle password reset OTP if needed
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
            subject: "Your Password Reset OTP",
            text: `Your password reset OTP is: ${otp}`,
            html: `<p>Your password reset OTP is: <strong>${otp}</strong></p>`
          });
          console.log("Password reset OTP email sent: %s", info.messageId);
        }
      }
    })
  ]
});
