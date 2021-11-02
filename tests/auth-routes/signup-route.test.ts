// Import from Libraries
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

describe("testing of SignUp route", () => {
  test("should return 422 upon empty fields", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "ss@lip.com",
        password: "**",
        confirm_password: "**",
        name: "",
      },
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
      url: "/auth/register",
      payload: {
        email: "ss",
        password: "**",
        confirm_password: "**",
        name: "ss",
      },
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

  test("should return 422 upon mismatched password", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "xyz@ss.com",
        password: "check123",
        confirm_password: "chek321",
        name: "ss",
      },
    });
    const expected = {
      code: 422,
      status: "error",
      message: "Passwords must be same",
    };

    response = response.json();
    response = _.pick(response, ["code", "status", "message"]);
    expect(response).toMatchObject(expected);
  });

  test("should return 409 upon duplicate error", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "ss@gmail.com",
        password: "check123",
        confirm_password: "check123",
        name: "ssk",
      },
    });
    const expected = {
      code: 409,
      status: "error",
      message: "Email already exists",
    };

    response = response.json();
    console.log(response);
    expect(_.pick(response, ["code", "status", "message"])).toMatchObject(
      expected
    );
  });

  test("should return 201 upon valid signup", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "sdm@gmail.com",
        password: "321",
        confirm_password: "321",
        name: "sdm",
      },
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
