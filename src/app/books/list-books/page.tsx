import ListBooksContent from "@/src/app/components/ListBooksContent";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/books/list";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

const ListBooksPage = () => {
  return <ListBooksContent />;
};

export default ListBooksPage;