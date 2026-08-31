import { z } from "zod";

export const BookSearchSchema = z
  .object({
    title: z.string().optional().default(""),
    author: z.string().optional().default(""),
    isbn: z.string().optional().default(""),
    subject: z.string().optional().default("")
  })
  .refine(
    (values) =>
      values.title.trim() !== "" ||
      values.author.trim() !== "" ||
      values.isbn.trim() !== "" ||
      values.subject.trim() !== "",
    {
      message: "Please enter at least one search criterion.",
      path: ["title"]
    }
  );