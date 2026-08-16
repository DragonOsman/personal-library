// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { auth } from "../../../auth";

const DEFAULT_SETTINGS = {
  showBookCovers: true,
  showRatings: true,
  showDescriptions: true,
  viewMode: "GRID",
  tileSize: "MEDIUM",
  booksPerPage: 20,
  defaultSort: "RECENT"
} as const;

const VALID_VIEW_MODES = ["GRID", "LIST"] as const;
const VALID_TILE_SIZES = ["SMALL", "MEDIUM", "LARGE"] as const;
const VALID_SORT_ORDERS = [
  "RECENT",
  "TITLE_ASC",
  "TITLE_DESC",
  "AUTHOR",
  "PUBLICATION_DATE",
  "RATING"
] as const;

type ViewMode = (typeof VALID_VIEW_MODES)[number];
type TileSize = (typeof VALID_TILE_SIZES)[number];
type SortOrder = (typeof VALID_SORT_ORDERS)[number];

interface LibrarySettingsInput {
  showBookCovers?: boolean;
  showRatings?: boolean;
  showDescriptions?: boolean;
  viewMode?: ViewMode;
  tileSize?: TileSize;
  booksPerPage?: number;
  defaultSort?: SortOrder;
}

function isValidViewMode(value: unknown): value is ViewMode {
  return (
    typeof value === "string" &&
    VALID_VIEW_MODES.includes(value as ViewMode)
  );
}

function isValidTileSize(value: unknown): value is TileSize {
  return (
    typeof value === "string" &&
    VALID_TILE_SIZES.includes(value as TileSize)
  );
}

function isValidSortOrder(value: unknown): value is SortOrder {
  return (
    typeof value === "string" &&
    VALID_SORT_ORDERS.includes(value as SortOrder)
  );
}

function isValidBooksPerPage(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= 100
  );
}

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
  viewMode: ViewMode;
  tileSize: TileSize;
  booksPerPage: number;
  defaultSort: SortOrder;
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
    console.error("Failed to retrieve library settings:", error);

    return NextResponse.json(
      { message: "Failed to retrieve library settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as LibrarySettingsInput;

    const data: LibrarySettingsInput = {};

    if (body.showBookCovers !== undefined) {
      if (typeof body.showBookCovers !== "boolean") {
        return NextResponse.json(
          { message: "showBookCovers must be a boolean" },
          { status: 400 }
        );
      }

      data.showBookCovers = body.showBookCovers;
    }

    if (body.showRatings !== undefined) {
      if (typeof body.showRatings !== "boolean") {
        return NextResponse.json(
          { message: "showRatings must be a boolean" },
          { status: 400 }
        );
      }

      data.showRatings = body.showRatings;
    }

    if (body.showDescriptions !== undefined) {
      if (typeof body.showDescriptions !== "boolean") {
        return NextResponse.json(
          { message: "showDescriptions must be a boolean" },
          { status: 400 }
        );
      }

      data.showDescriptions = body.showDescriptions;
    }

    if (body.viewMode !== undefined) {
      if (!isValidViewMode(body.viewMode)) {
        return NextResponse.json(
          {
            message: "Invalid viewMode",
            allowedValues: VALID_VIEW_MODES
          },
          { status: 400 }
        );
      }

      data.viewMode = body.viewMode;
    }

    if (body.tileSize !== undefined) {
      if (!isValidTileSize(body.tileSize)) {
        return NextResponse.json(
          {
            message: "Invalid tileSize",
            allowedValues: VALID_TILE_SIZES
          },
          { status: 400 }
        );
      }

      data.tileSize = body.tileSize;
    }

    if (body.booksPerPage !== undefined) {
      if (!isValidBooksPerPage(body.booksPerPage)) {
        return NextResponse.json(
          {
            message: "booksPerPage must be an integer between 1 and 100"
          },
          { status: 400 }
        );
      }

      data.booksPerPage = body.booksPerPage;
    }

    if (body.defaultSort !== undefined) {
      if (!isValidSortOrder(body.defaultSort)) {
        return NextResponse.json(
          {
            message: "Invalid defaultSort",
            allowedValues: VALID_SORT_ORDERS
          },
          { status: 400 }
        );
      }

      data.defaultSort = body.defaultSort;
    }

    const settings = await prisma.librarySettings.upsert({
      where: {
        userId: user.id
      },
      update: data,
      create: {
        userId: user.id,
        ...DEFAULT_SETTINGS,
        ...data
      }
    });

    return NextResponse.json({
      settings: serializeSettings(settings)
    });
  } catch (error) {
    console.error("Failed to update library settings:", error);

    return NextResponse.json(
      { message: "Failed to update library settings" },
      { status: 500 }
    );
  }
}