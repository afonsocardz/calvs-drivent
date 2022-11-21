import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { CreateTicket, ticketRepository } from "@/repositories/tickets-repository";
import enrollmentsService from "../enrollments-service";

async function create(userId: number, ticketTypeId: number) {
  const result = await enrollmentsService.getOneWithAddressByUserId(userId);

  const ticket: CreateTicket = {
    enrollmentId: result.id,
    ticketTypeId,
  };

  if (result.error) {
    throw notFoundError();
  }

  return await ticketRepository.create(ticket);
}

async function update(ticketId: number) {
  await ticketRepository.update(ticketId);
}

async function getTicket(userId: number) {
  const result = await enrollmentRepository.findWithTicketByUserId(userId);

  if (!result) {
    throw notFoundError();
  }

  const { Ticket: [ticket] } = result;

  return await getTicketById(ticket.id);
}

async function getTicketById(ticketId: number) {
  const ticket = await ticketRepository.getTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  return ticket;
}

async function getTicketTypes() {
  return await ticketRepository.getTicketTypes();
}

export const ticketService = {
  getTicket,
  getTicketById,
  getTicketTypes,
  create,
  update,
};
