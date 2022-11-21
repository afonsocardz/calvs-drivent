
import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function create(paymentData: CreatePayment) {
  return await prisma.payment.create({ data: paymentData });
}

async function getPaidTicketById(ticketId: number) {
  return await prisma.payment.findFirst({
    where: { ticketId }
  });
}

export type CreatePayment = Omit<Payment, "id" | "createdAt" | "updatedAt">

export type CreatePaymentParams = {
  ticketId: number;
  cardData: {
    issuer: string,
    number: number,
    name: string,
    expirationDate: Date,
    cvv: number
  };
};

export const paymentRepository = {
  getPaidTicketById,
  create,
};
