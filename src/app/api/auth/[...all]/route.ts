// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

import { auth } from "@/src/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
