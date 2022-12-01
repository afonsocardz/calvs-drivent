import { findBooking, postBooking, putBooking } from "@/controllers";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { createBookingSchema, updateBookingSchema } from "@/schemas";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", findBooking)
  .post("/", validateBody(createBookingSchema), postBooking)
  .put("/:bookingId", validateBody(createBookingSchema), validateParams(updateBookingSchema), putBooking);

export { bookingRouter };
