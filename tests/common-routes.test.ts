// Import from Packages
import _ from "lodash";

// Local Imports
import app from "../server";

afterAll(async () => {
  // close fastify-app after tests
  await app.close();
});

test("server status check", async () => {
  const response = await app.inject({ method: "GET", url: "/common" });
  expect(response.statusCode).toBe(200);
});

test("invalid routes check", async () => {
  const response = await app.inject({ method: "GET", url: "/xyz" });
  expect(response.statusCode).toBe(404);
});
