import { createContext, ReactNode, useState } from "react";

export interface IBook {
  book: {
    _id: string;
    title: string;
    isbn: string;
    author: string;
    description: string;
    published_date?: string;
    publisher: string;
    updated_date?: Date;
  };
}

interface BookProviderProps {
  children: ReactNode;
}

const Book: IBook = {
  book: {
    _id: "",
    title: "",
    isbn: "",
    author: "",
    description: "",
    published_date: "",
    publisher: ""
  }
};

const books: IBook[] = [Book];

interface IBookContext {
  bookContext: IBook[];
  setBookContext: (books: IBook[]) => void;
}

export const BookContext = createContext<IBookContext>({
  bookContext: books,
  setBookContext: () => {}
});

export const BookContextProvider = ({ children }: BookProviderProps) => {
  const [state, setState] = useState(books);

  return (
    <BookContext.Provider value={{ bookContext: state, setBookContext: setState }}>
      {children}
    </BookContext.Provider>
  );
};