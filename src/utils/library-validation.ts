// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { z } from "zod";

export const librarySettingsSchema = z.object({
  showBookCovers: z.boolean().optional(),
  showRatings: z.boolean().optional(),
  showDescriptions: z.boolean().optional(),

  viewMode: z.enum(["GRID", "LIST"]).optional(),

  tileSize: z.enum(["SMALL", "MEDIUM", "LARGE"]).optional(),

  booksPerPage: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional(),

  defaultSort: z.enum([
    "RECENT",
    "TITLE_ASC",
    "TITLE_DESC",
    "AUTHOR",
    "PUBLICATION_DATE",
    "RATING"
  ]).optional()
});

export type LibrarySettingsInput = z.infer<
  typeof librarySettingsSchema
>;