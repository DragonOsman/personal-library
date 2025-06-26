import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import BookList from "@/src/app/books/list-books/page";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return <SignIn />;
  } else {
    return (
      <div className="Homepage">
        <h1>Welcome, {user.fullName}</h1>
        <BookList />
      </div>
    );
  }
};

export default Page;