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