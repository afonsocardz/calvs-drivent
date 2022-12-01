import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: {
      id: bookingId
    }
  });
}

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    },
    include: {
      Room: true,
    }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  });
}

async function updateBooking(bookingId: number, roomId: number,) {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId
    }
  });
}

export type TCreateBooking = Omit<Booking, "createdAt" | "updatedAt" | "userId" | "id">;

export type TUpdateBooking = {
  bookingId: number
}

const bookingRepository = {
  updateBooking,
  createBooking,
  findBookingById,
  findBookingByUserId,
};

export default bookingRepository;
