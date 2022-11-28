import { AuthenticatedRequest } from "@/middlewares";
import { hotelService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const hotels = await hotelService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  const userId = req.userId;
  try {
    const rooms = await hotelService.getRoomsByHotelId(Number(hotelId), userId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if (error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
