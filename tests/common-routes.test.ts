import app from "../server";

test("server status check", async () => {
  const response = await (await app).inject("/");

  expect(response.statusCode).toBe(200);
});

/* describe("common routes tests", () => {
  test("should return 200 upon successful", async () => {
    const response = await app.inject("/");

    expect(response.statusCode).toBe(200);
  });
}); */
