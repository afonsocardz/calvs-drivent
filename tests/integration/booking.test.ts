import app, { init } from "@/app";
import faker from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { Booking, TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import supertest from "supertest";
import { createBooking, createEnrollmentWithAddress, createHotel, createRoomByHotelId, createTicket, createTicketTypeWithHotel, createUser, fillRoom, findBookingByUserId } from "../factories";
import { generateValidToken, cleanDb } from "../helpers";
import { object } from "joi";

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("when token is valid", () => {
    it("should response with status 400 when body data is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: -1 });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it("should response with status 404 when room not exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: 1 });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should response with status 403 when ticket is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it("should response with status 403 when the room has no vacancies", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      await fillRoom(room.capacity, room.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it("should response with status 403 when user already booked the room", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      await createBooking(user.id, room.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it("should response with status 200 with bookingId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });

      const booking: Booking = await findBookingByUserId(user.id);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          bookingId: booking.id
        })
      );
      expect(booking).toEqual(
        expect.objectContaining({
          id: response.body.bookingId,
          roomId: room.id,
          userId: user.id
        })
      );
    });
  });
});

describe("PUT /booking/:bookingId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/booking/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should response with status 400 when params is not valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.put("/booking/abc").set("Authorization", `Bearer ${token}`).send({ roomId: 1 });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it("should response with status 400 when body is not valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send({ roomId: -1 });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it("should response with status 403 when ticket is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it("should response with status 403 when user is not the booking owner", async () => {
      const user = await createUser();
      const otherUser = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      const booking = await createBooking(otherUser.id, room.id);

      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it("should response with status 404 when room not exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.put(`/booking/${booking.id}`).send({ roomId: room.id + 1 }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should response with status 403 when selected room has no vacancies", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const otherRoom = await createRoomByHotelId(hotel.id);
      await fillRoom(otherRoom.capacity, otherRoom.id);

      const response = await server.put(`/booking/${booking.id}`).send({ roomId: otherRoom.id }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it("should response with status 404 when booking is not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);

      const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should response with status 200 with bookingId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      const otherRoom = await createRoomByHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.put(`/booking/${booking.id}`).send({ roomId: otherRoom.id }).set("Authorization", `Bearer ${token}`);

      const updatedBooking = await findBookingByUserId(user.id);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          bookingId: booking.id
        })
      );
      expect(updatedBooking).toEqual(
        expect.objectContaining({
          id: booking.id,
          roomId: otherRoom.id,
          userId: user.id
        })
      );
    });
  });
});

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("when token is valid", () => {
    it("should response with status 404 when user has no booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      await fillRoom(room.capacity, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it("should response with status 200 bookingId and room data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomByHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: booking.id,
          Room: expect.objectContaining({
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            hotelId: room.hotelId,
          })
        })
      );
    });
  });
});
