import { redirect } from "next/dist/server/api-utils";
import { prisma } from "./lib/prisma";

const Home = () => {
  return (
    <h2>Welcome, Guest!</h2>
  );
};

export default Home;