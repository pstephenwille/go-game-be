import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app, options } from "@/app";
import Fastify from 'fastify';

const server = Fastify({
  logger: false,
  ...options
})


describe("POST & GET /index (Local Container Integration)", () => {
  // Wipe the Docker database clean before every single test run
  beforeAll(async () => {
    await server.register(app)
  });

  afterAll(async () => {
    await server.close()
  })

  it.only('should get Fake Test user from seeded data', async () => {
    const getResponse = await server.inject({
      method: "GET",
      url: `/users/d8c56429-2b7f-432f-a7d1-9cc9dc550926`
    });

    expect(getResponse.statusCode).toBe(200);
  })

  it("should create a new user, validate schemas, and persist to Docker DynamoDB", async () => {
    const postResponse = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        email: "alex@example.com"
      }
    });

    // 2. Validate response attributes and types
    expect(postResponse.statusCode).toBe(201);

    const createdUser = postResponse.json();
    expect(createdUser).toHaveProperty("user.userId");
    expect(createdUser.user.email).toBe("alex@example.com");

    // 3. Inject a subsequent GET request to ensure read-after-write consistency
    const getResponse = await server.inject({
      method: "GET",
      url: `/users/${createdUser.user.userId}`
    });

    expect(getResponse.statusCode).toBe(200);
  });

  it.skip("should return a 400 bad request if payload fails Zod schema verification", async () => {
    // Inject an invalid payload (missing mandatory email)
    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        name: "Broken Request"
      }
    });

    // Fastify automatically handles Zod errors if using fastify-type-provider-zod
    expect(response.statusCode).toBe(400);
  });
});