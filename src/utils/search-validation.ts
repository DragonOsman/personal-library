import { z } from "zod";

export const BookSearchSchema = z
  .object({
    title: z.string().trim(),
    author: z.string().trim(),
    isbn: z.string().trim(),
    subject: z.string().trim()
  })
  .refine(
    (values) =>
      values.title !== "" ||
      values.author !== "" ||
      values.isbn !== "" ||
      values.subject !== "",
    {
      message: "Enter at least one search criterion.",
      path: ["title"]
    }
  );