import dayjs from "dayjs";
import { CreatePayment, CreatePaymentParams, paymentRepository } from "@/repositories/payments-repository";
import { unauthorizedError } from "@/errors";
import { ticketService } from "../tickets-service";
import { ticketRepository } from "@/repositories/tickets-repository";

async function create(params: CreatePaymentParams, userId: number) {
  const { cardData: { issuer, number, expirationDate } } = params;

  isCardExpired(expirationDate.toString());

  const ticket = await ticketRepository.getTicketById(params.ticketId);
  isTicketOwner(userId, ticket.Enrollment.userId);

  const cardLastDigits = getLastDigits(number);

  const paymentData: CreatePayment = {
    ticketId: params.ticketId,
    value: ticket.TicketType.price,
    cardIssuer: issuer,
    cardLastDigits,
  };

  await ticketService.update(params.ticketId);

  return await paymentRepository.create(paymentData);
}

function isTicketOwner(userId: number, ticketUserId: number) {
  if (userId != ticketUserId) {
    throw unauthorizedError();
  }
}

async function getPaidTicketById(ticketId: number, userId: number) {
  const payment = await paymentRepository.getPaidTicketById(ticketId);

  const ticket = await ticketService.getTicketById(ticketId);
  isTicketOwner(userId, ticket.Enrollment.userId);

  return payment;
}

export function isCardExpired(expirationDate: string) {
  const cardDate = dayjs(`31/${expirationDate}`);
  const isExpired = dayjs().isAfter(cardDate);
  if (isExpired) {
    throw { type: "expired", message: "Card is expired" };
  }
}

function getLastDigits(number: number) {
  const lastDigits: string = number.toString();
  const DIGITS = 4;
  return lastDigits.slice(lastDigits.length - DIGITS, lastDigits.length);
}

export const paymentService = {
  getPaidTicketById,
  create,
};
