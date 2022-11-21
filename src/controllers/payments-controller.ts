import { AuthenticatedRequest } from "@/middlewares";
import { paymentService } from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

async function paymentsPost(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body;
  const userId = req.userId;

  try {
    const payment = await paymentService.create({ ticketId, cardData }, userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

async function getPaidTicketById(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const userId = req.userId;
  try {
    const payment = await paymentService.getPaidTicketById(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    console.log(error);
    if (error?.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export {
  paymentsPost,
  getPaidTicketById,
};
