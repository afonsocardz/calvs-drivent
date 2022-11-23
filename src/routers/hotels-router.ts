import { getHotels, getRoomsByHotelId } from "@/controllers";
import { authenticateToken, validateParams } from "@/middlewares";
import { getRoomsByHotelIdSchema } from "@/schemas";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/hotels/:hotelId", validateParams(getRoomsByHotelIdSchema), getRoomsByHotelId)
  .get("/hotels", getHotels);

export { hotelsRouter };
