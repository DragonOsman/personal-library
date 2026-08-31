// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

interface GoogleBooksImageLinks {
  thumbnail?: string;
  smallThumbnail?: string;
}

interface GoogleBooksVolumeInfo {
  imageLinks?: GoogleBooksImageLinks;
}

interface GoogleBooksVolume {
  volumeInfo?: GoogleBooksVolumeInfo;
}

interface GoogleBooksResponse {
  items?: GoogleBooksVolume[];
}

export const normalizeGoogleBooksImageUrl = (
  imageUrl?: string
): string | undefined => {
  if (!imageUrl) {
    return undefined;
  }

  return imageUrl.replace(/^http:\/\//i, "https://");
};

interface GoogleBooksCoverSearchOptions {
  isbn?: string;
  title?: string;
  author?: string;
}

export const getGoogleBooksCover = async ({
  isbn,
  title,
  author
}: GoogleBooksCoverSearchOptions): Promise<{
  thumbnail?: string;
  smallThumbnail?: string;
}> => {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Google API key is missing");
  }

  const queryParts: string[] = [];

  if (isbn?.trim()) {
    queryParts.push(`isbn:${isbn.trim()}`);
  } else {
    if (title?.trim()) {
      queryParts.push(`intitle:"${title.trim()}"`);
    }

    if (author?.trim()) {
      queryParts.push(`inauthor:"${author.trim()}"`);
    }
  }

  if (queryParts.length === 0) {
    return {};
  }

  const googleUrl = new URL(
    "https://www.googleapis.com/books/v1/volumes"
  );

  googleUrl.searchParams.set("q", queryParts.join(" "));
  googleUrl.searchParams.set("key", apiKey);
  googleUrl.searchParams.set("maxResults", "1");

  const response = await fetch(googleUrl);

  if (!response.ok) {
    const errorMessage = await response.text();

    console.error(
      `Google Books cover lookup failed: ${response.status} ${errorMessage}`
    );

    return {};
  }

  const data: GoogleBooksResponse = await response.json();

  const imageLinks = data.items?.[0]?.volumeInfo?.imageLinks;

  if (!imageLinks) {
    return {};
  }

  return {
    thumbnail: normalizeGoogleBooksImageUrl(
      imageLinks.thumbnail
    ),
    smallThumbnail: normalizeGoogleBooksImageUrl(
      imageLinks.smallThumbnail
    )
  };
};