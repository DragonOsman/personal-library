import AddBookContent from "@/src/app/components/AddBookContent";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/books/add";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

const AddBook = () => {
  return <AddBookContent />;
};

export default AddBook;
