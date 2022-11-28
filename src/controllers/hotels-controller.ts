import { AuthenticatedRequest } from "@/middlewares";
import { hotelService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  try {
    const rooms = await hotelService.getRoomsByHotelId(Number(hotelId));
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}