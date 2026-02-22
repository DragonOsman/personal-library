import { betterAuth } from "better-auth";
import prisma from "./app/lib/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, twoFactor, emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";

const emailServerUser = process.env.EMAIL_SERVER_USER || "";
const emailServerHost = process.env.EMAIL_SERVER_HOST || "";
const emailServerPort = parseInt(process.env.EMAIL_SERVER_PORT || "465");
const emailFrom = process.env.EMAIL_FROM || "";
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD || "";
const baseURL = process.env.BETTER_AUTH_URL || "";

const transporter = nodemailer.createTransport({
  host: emailServerHost,
  port: emailServerPort,
  secure: true,
  auth: {
    user: emailServerUser,
    pass: emailServerPassword
  }
});

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
        default: null,
        input: true
      }
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const result = await transporter.sendMail({
        from: emailFrom,
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p>`,
        text: `Click the link to verify your email: ${url}`
      });

      if (result.rejected.includes(user.email)) {
        console.error("Failed to send verification email");
        throw new Error("Failed to send verification email. Please try again.");
      } else if (result.accepted.includes(user.email)) {
        console.log("Verification email sent");
      }
    },
    sendOnSignUp: true
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
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string
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
        const result = await transporter.sendMail({
          from: emailFrom,
          to: email,
          subject: "Your Magic Link",
          html: `<p>Click the link to sign in: <a href="${url}">${url}</a></p><p>Or use this token: ${token}</p>`,
          text: `Click the link to sign in: ${url} Or use this token: ${token}`
        });
        if (result.rejected.includes(email)) {
          console.error("Failed to send magic link email:", result.rejected.length > 0 ? result.rejected[0] : "Unknown error");
          throw new Error("Failed to send magic link. Please try again.");
        } else if (result.accepted.includes(email)) {
          console.log("Magic link email sent:", result.accepted.length > 0 ? result.accepted[0] : "Unknown recipient");
        }
      }
    }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          const result = await transporter.sendMail({
            from: emailFrom,
            to: user.email,
            subject: "Your Two-Factor Authentication Code",
            html: `<p>Your 2FA code is: <strong>${otp}</strong></p>`,
            text: `Your 2FA code is: ${otp}`
          });

          if (result.rejected.includes(user.email)) {
            console.error("Failed to send 2FA email:", result.rejected.length > 0 ? result.rejected[0] : "Unknown error");
            throw new Error("Failed to send 2FA code. Please try again.");
          } else if (result.accepted.includes(user.email)) {
            console.log("2FA email sent:", result.accepted.length > 0 ? result.accepted[0] : "Unknown recipient");
          }
        }
      }
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        let subject = "";

        if (type === "sign-in") {
          subject = "Your sign-in code";
        } else if (type === "forget-password") {
          subject = "Your password reset code";
        } else if (type === "email-verification") {
          subject = "Your verifiction code";
        }
        const text = `${subject} is: ${otp}.`;

        const result = await transporter.sendMail({
          from: emailFrom,
          to: email,
          subject: "Your OTP Code",
          html: `<p>${text}</p>`,
          text
        });

        if (result.rejected.includes(email)) {
          console.error("Failed to send OTP email:", email);
          throw new Error("Failed to send OTP code. Please try again.");
        } else if (result.accepted.includes(email)) {
          console.log("OTP email sent:", email);
        }
      }
    })
  ]
});
