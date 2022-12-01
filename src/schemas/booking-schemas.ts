import { TCreateBooking, TUpdateBooking } from "@/repositories/booking-repository";
import Joi from "joi";

export const createBookingSchema = Joi.object<TCreateBooking>({
  roomId: Joi.number().greater(0).required()
});

export const updateBookingSchema = Joi.object<TUpdateBooking>({
  bookingId: Joi.number().greater(0).required()
});
