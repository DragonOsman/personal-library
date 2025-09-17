import NextAuth from "next-auth";
import { handlers } from "../../../../auth";
import prisma from "@prisma/client";
import { PrismaClient } from "../../../../generated/prisma";
import Nodemailer from "next-auth/providers/nodemailer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

