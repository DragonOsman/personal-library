import { redirect } from "next/dist/server/api-utils";
import { prisma } from "./lib/prisma";

const Home = () => {
  return (
    <h2>Welcome to the Public Homepage!</h2>
  );
};

export default Home;