require("dotenv").config();

import Fastify from "fastify";
import "./db/db-connector";
import { commonroutes } from "./routes/common-routes";

const API_PORT = process.env.API_PORT || "9040";
const API_BIND_ADDR = process.env.API_BIND_ADDR || "0.0.0.0";

const fastify = Fastify({ logger: true });

// registering common routes
fastify.register(commonroutes);

fastify.listen(API_PORT, API_BIND_ADDR, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.info(`Server listening on ${address}`);
});

export { fastify };