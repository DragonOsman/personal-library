// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { auth } from "@/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
