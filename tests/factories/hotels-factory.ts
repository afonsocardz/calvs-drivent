import faker from "@faker-js/faker";

import { prisma } from "@/config";

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.internet.url(),
    }
  });
}

export async function createRoomByHotelId(hotelId: number) {
  return await prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: Number(faker.random.numeric()),
      hotelId,
    }
  });
}
