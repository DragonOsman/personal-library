// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { z } from "zod";

const optionalSearchString = z.preprocess(
  (value) =>
    typeof value === "string"
      ? value
      : "",
  z.string()
);

export const BookSearchSchema = z
  .object({
    title: optionalSearchString,
    author: optionalSearchString,
    isbn: optionalSearchString,
    subject: optionalSearchString
  })
  .refine(
    (values) =>
      values.title.trim() !== "" ||
      values.author.trim() !== "" ||
      values.isbn.trim() !== "" ||
      values.subject.trim() !== "",
    {
      message:
        "Please enter at least one search criterion.",
      path: ["title"]
    }
  );