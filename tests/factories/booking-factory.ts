import { prisma } from "@/config";
import { createUser } from "./users-factory";

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

export async function findBookingByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId
    }
  });
}

export async function fillRoom(maxCapacity: number, roomId: number) {
  const bookings = [];
  for (let i = 0; i < maxCapacity; i++) {
    const user = await createUser();
    bookings.push({
      userId: user.id,
      roomId
    });
  }
  return await prisma.booking.createMany({
    data: bookings
  });
}
