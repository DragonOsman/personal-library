import { redirect } from "next/navigation";
import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  if (session && !session?.user) {
    redirect("api/auth/login");
  }

  if (session) {
    const user = session.user;

    return (
      <h2>Welcome to your Dashboard, ${user?.name}!</h2>
    );
  }

  redirect("/api/auth/login");
};

export default Home;