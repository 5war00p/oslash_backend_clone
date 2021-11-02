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

describe("listing shortcuts of one user", () => {
  let access_token: string, refresh_token: string;

  test("accessing protected route without tokens", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/user/shortcut/search",
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

  test("response upon requesting without search_key", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/user/shortcut/search",
      payload: {}, // not passing search_key
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-my-access-token": access_token,
        "x-my-refresh-token": refresh_token,
      },
    });
    const expected = {
      code: 406,
      status: "error",
      message: "Missing some required fields",
    };

    response = response.json();
    expect(_.pick(response, ["code", "status", "message"])).toMatchObject(
      expected
    );
  });

  test("response for matched search_key results", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/user/shortcut/search",
      payload: { search_key: "mail" }, // search_key must be given
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
    expect(response.data).not.toBeNull();
  });

  test("response for not matched search_key results", async () => {
    let response: any = await app.inject({
      method: "POST",
      url: "/user/shortcut/search",
      payload: { search_key: "mms" }, // search_key must be given
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-my-access-token": access_token,
        "x-my-refresh-token": refresh_token,
      },
    });
    const expected = {
      code: 200,
      status: "success",
      data: "No results found for your search keyword",
    };
    response = response.json();
    expect(_.pick(response, ["code", "status", "data"])).toMatchObject(
      expected
    );
  });
});
