import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketsSchema } from "@/schemas";
import { getTicket, getTicketTypes, postTicket } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .post("/", validateBody(createTicketsSchema), postTicket)
  .get("/types", getTicketTypes)
  .get("/", getTicket);

export { ticketsRouter };
