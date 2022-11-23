import { notFoundError } from "@/errors";
import { hotelRepository } from "@/repositories/hotel-repository";

async function getHotels() {
  const hotels = await hotelRepository.getHotels();
  if (hotels.length == 0) {
    throw notFoundError();
  }
  return hotels;
}

async function getRoomsByHotelId(hotelId: number) {
  const hotels = await hotelRepository.getRoomsByHotelId(hotelId);

  if (!hotels) {
    throw notFoundError();
  }

  return hotels.Rooms;
}

export const hotelService = {
  getHotels,
  getRoomsByHotelId,
};
