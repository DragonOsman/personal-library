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

interface IBookContext {
  bookContext: IBook;
  setBookContext: (book: IBook) => void;
}

export const BookContext = createContext<IBookContext>({
  bookContext: Book,
  setBookContext: () => {}
});

export const BookContextProvider = ({ children }: BookProviderProps) => {
  const [state, setState] = useState(Book);

  return (
    <BookContext.Provider value={{ bookContext: state, setBookContext: setState }}>
      {children}
    </BookContext.Provider>
  );
};