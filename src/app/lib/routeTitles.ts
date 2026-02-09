export const baseTitle = "Personal Library App";

export const routeMap: Record<string, { title: string, keywords: string[] }> = {
  "/": {
    title: "Home",
    keywords: ["Home", "Library", "Books", "Next.js", "TypeScript"]
  },
  "/books/add-book": {
    title: "Add a Book",
    keywords: ["Add a Book", "Library", "Books", "Next.js", "TypeScript"]
  },
  "/books/list-books": {
    title: "List Books",
    keywords: ["List Books", "Library", "Books", "Next.js", "TypeScript"]
  },
  "/auth/signin": {
    title: "Sign In",
    keywords: ["Sign In", "Library", "Books", "Next.js", "TypeScript"]
  },
  "/auth/signup": {
    title: "Sign Up",
    keywords: ["Sign Up", "Library", "Books", "Next.js", "TypeScript"]
  },
  "/users/profile": {
    title: "Profile",
    keywords: ["Profile", "Library", "Books", "Next.js", "TypeScript"]
  },
  "/users/settings": {
    title: "Settings",
    keywords: ["Settings", "Library", "Books", "Next.js", "TypeScript"]
  }
};

export function getRouteTitle(pathname: string): string {
  const dynamicPart = routeMap[pathname];

  if (dynamicPart &&
    typeof dynamicPart.title === "string" &&
    dynamicPart.title.trim().length > 0 &&
    dynamicPart.keywords.length > 0 &&
    dynamicPart.keywords.every(k => typeof k === "string" && k.trim().length > 0)
  ) {
    return `${baseTitle} - ${dynamicPart.title}`;
  }
  return baseTitle;
}

export function getRouteKeywords(pathname: string): string[] {
  const dynamicPart = routeMap[pathname];
  if (dynamicPart &&
    typeof dynamicPart.title === "string" &&
    dynamicPart.title.trim().length > 0 &&
    dynamicPart.keywords.length > 0 &&
    dynamicPart.keywords.every(k => typeof k === "string" && k.trim().length > 0)
  ) {
    return dynamicPart.keywords;
  }
  return ["Library", "Books", "Next.js", "TypeScript"];
}