// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    }
  }
}