// Import from Libraries
import _ from "lodash";

// Local Imports
import app from "../../server";
import db from "../../db/db-connector";

// Setting up custom timeout to 10s
jest.setTimeout(10000);

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

describe("testing Login route", () => {
  test("should return 422 upon empty fields", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "xyz", password: "" },
    });
    const expected = {
      code: 422,
      status: "error",
      message: "Some fields are missing",
    };

    response = _.pick(response.json(), ["code", "status", "message"]);
    expect(response).toMatchObject(expected);
  });

  test("should return 422 upon invalid email", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "xyz", password: "check123" },
    });
    const expected = {
      code: 422,
      status: "error",
      message: "Invalid Email",
    };

    response = response.json();
    response = _.pick(response, ["code", "status", "message"]);
    expect(response).toMatchObject(expected);
  });

  test("should return 401 upon not existed user login", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "xyz@ss.com", password: "123" },
    });
    const expected = {
      code: 401,
      status: "error",
      message: "Seems entered user details not exists!",
    };

    response = response.json();
    expect(_.pick(response, ["code", "status", "message"])).toMatchObject(
      expected
    );
  });

  test("should return 401 for incorrect credentials", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "ss@gmail.com", password: "12345" },
    });
    const expected = {
      code: 401,
      status: "error",
      message: "Incorrect credentials",
    };

    response = response.json();
    expect(_.pick(response, ["code", "status", "message"])).toMatchObject(
      expected
    );
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
    expect(_.pick(response, ["code", "status"])).toMatchObject(expected);
    expect(response).toHaveProperty("access_token");
    expect(response).toHaveProperty("refresh_token");
    expect(response).toHaveProperty("data._id");
    expect(response).toHaveProperty("data.version");
    expect(response).toHaveProperty("data.isLoggedIn");
  });
});
