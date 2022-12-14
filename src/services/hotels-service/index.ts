import { forbiddenError, notFoundError } from "@/errors";
import { hotelRepository } from "@/repositories/hotel-repository";
import { TicketStatus } from "@prisma/client";
import { ticketService } from "../tickets-service";

async function getHotels(userId: number) {
  const hotels = await hotelRepository.getHotels();
  if (hotels.length == 0) {
    throw notFoundError();
  }
  await validateTicketWithHotel(userId);
  return hotels;
}

async function getRoomsByHotelId(hotelId: number, userId: number) {
  const hotel = await hotelRepository.getRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  await validateTicketWithHotel(userId);

  return hotel;
}

export async function validateTicketWithHotel(userId: number) {
  const ticket = await ticketService.getTicket(userId);
  const ticketType = ticket.TicketType;
  if (ticketType.isRemote === true || ticketType.includesHotel === false || ticket.status != TicketStatus.PAID) {
    throw forbiddenError();
  }
}

export const hotelService = {
  validateTicketWithHotel,
  getHotels,
  getRoomsByHotelId,
};
