import bcrypt from "bcryptjs";
import prisma from "./db";
import { randomInt } from "crypto";
import { redis } from "./redis";

export const verifyPassword = async (userId: string, password: string) => {
  const record = await prisma.password.findUnique({ where: { userId } });

  if (!record) {
    return false;
  }

  const isValid = await bcrypt.compare(password, record.hash);
  return isValid;
};

export const generateAndStoreOtp = async (email: string) => {
  const otp = String(randomInt(100000, 999999));
  await redis.set(`otp:${email}`, otp, { ex: 5 * 60 }); // expire in 5 minutes
  return otp;
};