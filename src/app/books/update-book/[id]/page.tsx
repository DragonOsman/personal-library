// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import UpdateBookContent from "@/src/app/components/UpdateBookContent";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/lib/routeTitles";

interface UpdateBookPageProps {
  params: {
    id: string;
  };
}

export const generateMetadata = ({ params }: UpdateBookPageProps): Metadata => {
  const pathname = `/books/update/${params.id}`;
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

const UpdateBookPage = ({ params }: UpdateBookPageProps) => {
  return <UpdateBookContent params={params} />;
};

export default UpdateBookPage;