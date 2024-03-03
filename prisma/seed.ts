/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const seedingObject = {
  name: "John Doe",
  email: "admin@aicsvquery.com",
  password: "admin123",
  role: "ADMIN",
  isEmailVerify: true,
  status: "ACTIVE",
};

async function main() {
  const userSettings = await prisma.userSettings.create({
    data: {},
  });

  await prisma.users.create({
    data: {
      email: seedingObject.email,
      password: await bcrypt.hash(seedingObject.password, 12),
      name: seedingObject.name,
      userSettingId: userSettings.id,
      isEmailVerify: seedingObject.isEmailVerify,
      role: seedingObject.role,
      status: seedingObject.status,
    },
  });
}

main()
  .then(async () => {
    console.log(
      `Seed data created successfully: \nName: '${seedingObject.name}', \nEmail: '${seedingObject.email}', \nPassword: '${seedingObject.password}', \nRole: '${seedingObject.role}', \nisEmailVerify:${seedingObject.isEmailVerify}, \nstatus:'${seedingObject.status}', \n`,
    );

    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("😒😒 Error on data seeding: 😒😒 or \n", e);
    await prisma.$disconnect();
    process.exit(1);
  });
