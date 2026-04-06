// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: env("DATABASE_URL_UNPOOLED")
  }
});
