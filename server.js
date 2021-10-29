require("dotenv").config();

import Fastify from "fastify";
import commonRoutes from "./routes/common-routes";

API_PORT = process.env.API_PORT || "9040";
API_BIND_ADDR = process.env.API_BIND_ADDR || "0.0.0.0";

const fastify = Fastify({ logger: true });

fastify.register(commonRoutes);

fastify.listen(API_PORT, API_BIND_ADDR, (err, address) => {
  if (err) {
    fastify.log.err(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
