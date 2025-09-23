import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import prisma from "../../lib/db";
import PasswordSection from "./PasswordSection";
import BookSection from "./BooksSection";
import MfaSection from "./MfaSection";

export const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {  books: true}
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Profile</h1>

      <section>
        <h2 className="text-lg font-semibold">Welcome, {session.user?.name}</h2>
        <p>Email: {session.user?.email}</p>
      </section>

      <MfaSection enabled={user.mfaEnabled} />
      <PasswordSection />
      <BookSection books={user.books} />
    </>
  );
};

export default ProfilePage;
