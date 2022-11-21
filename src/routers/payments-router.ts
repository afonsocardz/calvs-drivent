import { Router } from "express";

import { createPaymentSchema, getPaymentByTicketIdSchema } from "@/schemas";
import { authenticateToken, validateBody, validateQuery } from "@/middlewares";
import { getPaidTicketById, paymentsPost } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .post("/process", validateBody(createPaymentSchema), paymentsPost)
  .get("/", validateQuery(getPaymentByTicketIdSchema), getPaidTicketById);

export { paymentsRouter };
