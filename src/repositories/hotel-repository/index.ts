import { prisma } from "@/config";

async function getHotels() {
  return await prisma.hotel.findMany({});
}

async function getRoomsByHotelId(hotelId: number) {
  return await prisma.hotel.findFirst({
    where: {
      id: hotelId
    },
    include: {
      Rooms: true
    }
  });
}

export type TRoomsByHotelId = {
  hotelId: string
}

export const hotelRepository = {
  getHotels,
  getRoomsByHotelId,
};
