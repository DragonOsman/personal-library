import "dotenv/config";
import prisma from "../src/lib/db";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true
    }
  });

  console.log(`Found ${users.length} existing user(s).`);

  const result = await prisma.userSettings.createMany({
    data: users.map(user => ({
      userId: user.id
    })),
    skipDuplicates: true
  });

  console.log(`Created ${result.count} UserSettings row(s).`);
  console.log("Existing UserSettings rows were left unchanged.");
}

main()
  .catch(error => {
    console.error("Failed to create user settings:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });