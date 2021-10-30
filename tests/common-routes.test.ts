import { fastify } from "../server";

test("server status check", async () => {
  const response = await fastify.inject("/");

  expect(response.statusCode).toBe(200);
});

/* describe("common routes tests", () => {
  test("should return 200 upon successful", async () => {
    const response = await fastify.inject("/");

    expect(response.statusCode).toBe(200);
  });
}); */
