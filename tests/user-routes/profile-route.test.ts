// Import from Packages
import _ from "lodash";

// Local Imports
import app from "../../server";
import db from "../../db/db-connector";

beforeAll(async () => {
  // connect db before tests
  await db.connectDB();
});

afterAll(async () => {
  // close db connection after tests
  await db.mongoose.connection.close();

  // close fastify-app after tests
  await app.close();
});

describe("testing user profile route", () => {
  let access_token: string, refresh_token: string;

  test("reject accessing protected route without tokens", async () => {
    let response: any = await app.inject({
      method: "GET",
      url: "/user/profile",
    });
    const expected = {
      code: 401,
      status: "error",
      message: "Authentication token not provided!",
    };

    response = _.pick(response.json(), ["code", "status", "message"]);
    expect(response).toMatchObject(expected);
  });

  test("should return 201 upon valid login", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "ss@gmail.com", password: "123" },
    });
    const expected = {
      code: 201,
      status: "success",
    };

    response = response.json();

    access_token = response["access_token"];
    refresh_token = response["refresh_token"];

    expect(_.pick(response, ["code", "status"])).toMatchObject(expected);
    expect(response).toHaveProperty("access_token");
    expect(response).toHaveProperty("refresh_token");
    expect(response).toHaveProperty("data._id");
    expect(response).toHaveProperty("data.version");
    expect(response).toHaveProperty("data.isLoggedIn");
  });

  test("reject if invalid token provided", async () => {
    let response: any = await app.inject({
      method: "GET",
      url: "/user/profile",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-my-access-token": access_token + "zigzaggag", // corrupted token
        "x-my-refresh-token": refresh_token,
      },
    });
    const expected = {
      err_code: 401,
      err_message: "Invalid authentication token!",
    };

    response = _.pick(response.json(), ["err_code", "err_message"]);
    expect(response).toMatchObject(expected);
  });

  test("user not found with given id from tokens", async () => {
    let response: any = await app.inject({
      method: "GET",
      url: "/user/profile",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-my-access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTgwZDA3NzhjZDRjNzc2ZGU3YjkzYTYiLCJpc0xvZ2dlZEluIjp0cnVlLCJ2ZXJzaW9uIjoiMS4wIiwiaWF0IjoxNjM1ODM4MTgwLCJleHAiOjE2MzU4NDE3ODB9.7ZdWJm7iljkYFIvCJm08drBlLsnPOSYN25jX1nAI-ZA",
        "x-my-refresh-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTgwZDA3NzhjZDRjNzc2ZGU3YjkzYTYiLCJpc0xvZ2dlZEluIjp0cnVlLCJ2ZXJzaW9uIjoiMS4wIiwiaWF0IjoxNjM1ODM4MTgwLCJleHAiOjE2MzgyNTczODB9.pGK4bcOj6IddUKiWMbPSWFZh71l8W34uMGtYjqZwP1g",
      }, // delete user id tokens
    });
    const expected = {
      code: 404,
      status: "error",
      message: "User not found",
    };
    response = response.json();
    response = _.pick(response, ["code", "status", "message"]);
    expect(response).toMatchObject(expected);
  });

  test("provide user profile details upon successful", async () => {
    let response: any = await app.inject({
      method: "GET",
      url: "/user/profile",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-my-access-token": access_token,
        "x-my-refresh-token": refresh_token,
      },
    });
    const expected = {
      code: 200,
      status: "success",
    };

    response = response.json();
    expect(_.pick(response, ["code", "status"])).toMatchObject(expected);
    expect(response).toHaveProperty("data.email");
    expect(response).toHaveProperty("data.name");
    expect(response).toHaveProperty("data.shortcuts");
  });
});
