import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { auth } from "../../../auth";

const DEFAULT_SETTINGS = {
  showCoverImages: true,
  viewMode: "GRID",
  tileSize: "MEDIUM"
} as const;

const VALID_VIEW_MODES = ["GRID", "LIST"] as const;
const VALID_TILE_SIZES = ["SMALL", "MEDIUM", "LARGE"] as const;

type ViewMode = (typeof VALID_VIEW_MODES)[number];
type TileSize = (typeof VALID_TILE_SIZES)[number];

interface LibrarySettingsInput {
  showBookCovers?: boolean;
  viewMode?: ViewMode;
  tileSize?: TileSize;
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

async function getAuthenticatedUser(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  return session?.user ?? null;
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
      settings: {
        showBookCovers: settings.showBookCovers,
        viewMode: settings.viewMode,
        tileSize: settings.tileSize,
        showRatings: settings.showRatings,
        showDescriptions: settings.showDescriptions,
        booksPerPage: settings.booksPerPage,
        defaultSort: settings.defaultSort,
        updatedAt: settings.updatedAt,
        createdAt: settings.createdAt
      }
    });
  } catch (error) {
    console.error("Failed to retrieve library settings:", error);

    return NextResponse.json(
      { message: "Failed to retrieve library settings" },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const librarySettings = await prisma.librarySettings.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        ...body
      },
      create: {
        userId: session.user.id,
        ...body
      }
    });

    return NextResponse.json(librarySettings);
  } catch (error) {
    console.error("Failed to update library settings:", error);

    return NextResponse.json(
      { error: "Failed to update library settings" },
      { status: 500 }
    );
  }
};