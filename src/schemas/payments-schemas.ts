import { PaymentByTicketId } from "@/protocols";
import { CreatePaymentParams } from "@/repositories/payments-repository";
import Joi from "joi";

export const createPaymentSchema = Joi.object<CreatePaymentParams>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string(),
    number: Joi.number(),
    name: Joi.string(),
    expirationDate: Joi.string(),
    cvv: Joi.number()
  })
});

export const getPaymentByTicketIdSchema = Joi.object<PaymentByTicketId>({
  ticketId: Joi.number().required()
});
