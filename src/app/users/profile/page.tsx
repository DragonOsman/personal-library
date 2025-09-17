import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { PasswordSection } from "./PasswordSection";

export const ProfilePage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
};

export default ProfilePage;
