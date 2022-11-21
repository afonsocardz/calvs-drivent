import { CreateTicketParams } from "@/repositories/tickets-repository";
import Joi from "joi";

export const createTicketsSchema = Joi.object<CreateTicketParams>({
  ticketTypeId: Joi.number().required(),
});
