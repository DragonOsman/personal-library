import { redirect } from "next/dist/server/api-utils";
import { prisma } from "./lib/prisma";

const Home = () => {
  return (
    <main>
      <h2>Welcome to the Public Homepage!</h2>
    </main>
  );
};

export default Home;