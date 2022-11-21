import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  let ticketType = await prisma.ticketType.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  if (!ticketType) {
    const ticketTypes = await prisma.ticketType.createMany({
      data: [
        {
          name: "Online",
          price: 1111,
          isRemote: true,
          includesHotel: false,
          updatedAt: dayjs().toDate(),
        },
        {
          name: "Com Hotel",
          price: 1111,
          isRemote: false,
          includesHotel: false,
          updatedAt: dayjs().toDate(),
        },
        {
          name: "Sem Hotel",
          price: 1111,
          isRemote: false,
          includesHotel: true,
          updatedAt: dayjs().toDate(),
        },
      ]
    })
    console.log(ticketTypes);
  }
  
  
  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
