import { notFoundError } from "@/errors";
import { hotelRepository } from "@/repositories/hotel-repository";

async function getHotels() {
  const hotels = await hotelRepository.getHotels();
  if (hotels.length == 0) {
    throw notFoundError();
  }
  return hotels;
}

export const hotelService = {
  getHotels,
};
