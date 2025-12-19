import { z } from "zod";

export const ImageLinksSchema = z.object({
  thumbnail: z.string().url().optional(),
  smallThumbnail: z.string().url().optional()
});

export const BaseBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.string().min(1, "At least one author is required"),
  description: z.string().min(1, "Description is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  publishedDate: z.string().min(1, "Published date is required"),
  categories: z.array(z.string()).optional(),
  pageCount: z.number().int().positive().optional(),
  averageRating: z.number().min(0).max(5).optional(),
  ratingsCount: z.number().int().min(0).optional(),
  imageLinks: z.object({
    thumbnail: z.string().url().optional(),
    smallThumbnail: z.string().url().optional()
  }).optional()
});