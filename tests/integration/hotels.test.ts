import app, { init } from "@/app";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createUser, createHotel } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(() => {
  init();
});

beforeEach(() => {
  cleanDb();
});

const server = supertest(app);

describe("/GET Hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 with empty array when there's no hotels", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const result = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.NOT_FOUND);
      expect(result.body).toEqual([]);
    });
    it("should respond with status 200 with an array with hotels", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotel();

      const result = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.OK);
      expect(result.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String)
          })
        ])
      );
    });
  });
});
