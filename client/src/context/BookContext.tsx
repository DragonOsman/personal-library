import { createContext, ReactNode, useState } from "react";

export interface IBook {
  _id: string;
  title: string;
  isbn: string;
  author: string;
  description: string;
  published_date?: string;
  publisher: string;
  updated_date?: Date;
}

interface BookProviderProps {
  children: ReactNode;
}

const Books: IBook[] = [{
  _id: "",
  title: "",
  isbn: "",
  author: "",
  description: "",
  published_date: "",
  publisher: ""
}];

interface IBookContext {
  booksContext: IBook[];
  setBooksContext: (books: IBook[]) => void;
}

export const BookContext = createContext<IBookContext>({
  booksContext: Books,
  setBooksContext: () => {}
});

export const BookContextProvider = ({ children }: BookProviderProps) => {
  const [state, setState] = useState(Books);

  return (
    <BookContext.Provider value={{ booksContext: state, setBooksContext: setState }}>
      {children}
    </BookContext.Provider>
  );
};