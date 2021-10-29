async function routes(fastify, options) {
  fastify.get("/login", async (req, res) => {
    return { message: "This is login route..!" };
  });
}

module.export = routes;
