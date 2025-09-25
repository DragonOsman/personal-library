import BookList from "@/src/app/books/list-books/page";
import { auth } from "@/src/auth";
import SignIn from "@/src/app/components/Signin";

const Page = async () => {
  const session = await auth();
  if (!session) {
    return <SignIn />;
  }

  const user = session.user;
  if (!user) {
    return <SignIn />;
  } else {
    return (
      <div className="Homepage">
        <h1>Welcome, {user.name}</h1>
        <BookList />
      </div>
    );
  }
};

export default Page;