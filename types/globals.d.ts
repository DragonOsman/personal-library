// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    }
  }
}