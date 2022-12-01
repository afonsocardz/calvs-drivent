import { forbiddenError, notFoundError } from "@/errors";
import roomRepository from "@/repositories/room-repository";
import { exclude } from "@/utils/prisma-utils";
import { Booking, Room } from "@prisma/client";
import bookingRepository from "../../repositories/booking-repository";
import { validateTicketWithHotel } from "../hotels-service";

async function createBooking(userId: number, roomId: number) {
  const room = await isRoomExists(roomId);
  await validateTicketWithHotel(userId);
  await isRoomHasVacancies(room);
  await isBookingAlreadyExists(userId);

  const booking: Booking = await bookingRepository.createBooking(userId, roomId);

  return exclude(booking, "userId", "roomId", "createdAt", "updatedAt");
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  await validateTicketWithHotel(userId);
  const room = await isRoomExists(roomId);
  const booking = await isBookingExists(bookingId);
  await isUserOwnBooking(userId, booking.userId);
  await isRoomHasVacancies(room);

  const updatedBooking: Booking = await bookingRepository.updateBooking(bookingId, roomId);

  return updatedBooking;
}

async function findBookingByUserId(userId: number) {
  await validateTicketWithHotel(userId);
  const booking = await bookingRepository.findBookingByUserId(userId);
  return {
    id: booking.id,
    Room: booking.Room
  };
}

async function isBookingExists(bookingId: number) {
  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function isUserOwnBooking(userId: number, bookingUserId: number) {
  if (userId !== bookingUserId) {
    throw forbiddenError();
  }
}

async function isBookingAlreadyExists(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (booking) {
    throw forbiddenError();
  }
}

async function isRoomExists(roomId: number) {
  const room = await roomRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }
  return room;
}

async function isRoomHasVacancies(room: Room & { Booking: Booking[] }) {
  if (room.capacity === room.Booking.length) {
    throw forbiddenError();
  }
}

const bookingService = {
  createBooking,
  updateBooking,
  findBookingByUserId,
};

export default bookingService;
