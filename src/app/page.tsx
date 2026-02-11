import BookList from "@/src/app/books/list-books/page";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

const Page = () => {
  return (
    <div className="Homepage">
      <h1>Welcome to the Personal Library App</h1>
      <BookList />
    </div>
  );
};

export default Page;