import { z } from "zod";

export const BookSearchSchema = z
  .object({
    title: z.string(),
    author: z.string(),
    isbn: z.string(),
    subject: z.string()
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