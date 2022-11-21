import { prisma } from "@/config";
import { Ticket, TicketStatus, TicketType } from "@prisma/client";
import dayjs from "dayjs";

async function getTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    }
  });
}

async function getTicket(enrollmentId: number): Promise<Ticket> {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId
    },
    include: {
      TicketType: true,
    }
  });
}

async function getTicketTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function create(ticket: CreateTicket) {
  return await prisma.ticket.create({
    data: {
      ...ticket,
      status: TicketStatus.RESERVED,
      updatedAt: dayjs().toDate(),
    },
    include: {
      TicketType: true,
    }
  });
}

async function update(ticketId: number): Promise<void> {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    }
  });
}

export type CreateTicket = Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">

export type CreateTicketParams = Pick<Ticket, "ticketTypeId">

export const ticketRepository = {
  getTicket,
  getTicketTypes,
  getTicketById,
  create,
  update,
};
