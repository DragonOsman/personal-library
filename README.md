# DragonOsman Personal Library Application

A full-stack web application for managing a personal library. Users can create an account, search for books, and manage a collection of books they have read or want to read.

The application provides user authentication and account management through Better Auth, with PostgreSQL used for persistent data storage.

**[Live Application](https://personal-library-wmjc.vercel.app)**

## Features

- User registration and authentication
- Email verification
- Password-based authentication
- OAuth authentication
- Two-factor authentication
- Account and profile management
- Search for books using the Google Books API
- Add books to a personal library
- View, update, and remove books from a library
- Track books a user has read or wants to read

## Architecture and Technology

The application is built with:

- **Next.js** — full-stack React framework using the App Router
- **TypeScript** — type-safe application development
- **PostgreSQL** — relational database for persistent application data
- **Prisma** — ORM and database access layer
- **Better Auth** — authentication and account management
- **Tailwind CSS** — utility-first CSS framework
- **DaisyUI** — UI components built on Tailwind CSS
- **Google Books API** — book search and metadata

The application follows a full-stack architecture in which Next.js handles both the frontend and server-side application logic. Prisma provides the database access layer between the application and PostgreSQL, while Better Auth manages authentication, sessions, and account-related functionality.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.