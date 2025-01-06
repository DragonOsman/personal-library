import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return <SignIn />;
  } else {
    return (
      <h1>Welcome, {user.fullName}</h1>
      /*

      The books list will be displayed here once the functionality has
      been added in.

      */
    );
  }
};

export default Page;