// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { auth } from "../../../auth";
import {
  librarySettingsSchema
} from "../../../utils/library-validation";
import { z } from "zod";

const DEFAULT_SETTINGS = {
  showBookCovers: true,
  showRatings: true,
  showDescriptions: true,
  viewMode: "GRID",
  tileSize: "MEDIUM",
  booksPerPage: 20,
  defaultSort: "RECENT"
} as const;

async function getAuthenticatedUser(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  return session?.user ?? null;
}

function serializeSettings(settings: {
  showBookCovers: boolean;
  showRatings: boolean;
  showDescriptions: boolean;
  viewMode: string;
  tileSize: string;
  booksPerPage: number;
  defaultSort: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    showBookCovers: settings.showBookCovers,
    showRatings: settings.showRatings,
    showDescriptions: settings.showDescriptions,
    viewMode: settings.viewMode,
    tileSize: settings.tileSize,
    booksPerPage: settings.booksPerPage,
    defaultSort: settings.defaultSort,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt
  };
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    let settings = await prisma.librarySettings.findUnique({
      where: {
        userId: user.id
      }
    });

    if (!settings) {
      settings = await prisma.librarySettings.create({
        data: {
          userId: user.id,
          ...DEFAULT_SETTINGS
        }
      });
    }

    return NextResponse.json({
      settings: serializeSettings(settings)
    });
  } catch (error) {
    console.error(
      "Failed to retrieve library settings:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to retrieve library settings"
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();

    const result = librarySettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid library settings",
          errors: z.treeifyError(result.error)
        },
        { status: 400 }
      );
    }

    const settings = await prisma.librarySettings.upsert({
      where: {
        userId: user.id
      },
      update: result.data,
      create: {
        userId: user.id,
        ...DEFAULT_SETTINGS,
        ...result.data
      }
    });

    return NextResponse.json({
      settings: serializeSettings(settings)
    });
  } catch (error) {
    console.error(
      "Failed to update library settings:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update library settings"
      },
      { status: 500 }
    );
  }
}