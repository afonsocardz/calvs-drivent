import { TRoomsByHotelId } from "@/repositories/hotel-repository";
import Joi from "joi";

export const getRoomsByHotelIdSchema = Joi.object<TRoomsByHotelId>({
  hotelId: Joi.string().required(),
});
