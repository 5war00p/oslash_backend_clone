// Imports from packages
import Fastify from "fastify";
require("dotenv").config(); //.env configuration

// Local imports
import { authRoutes } from "./routes/auth-routes";
import { userRoutes } from "./routes/user-routes";
import { commonRoutes } from "./routes/common-routes";
import { shortcutRoutes } from "./routes/shortcut-routes";
import db from "./db/db-connector";

const API_PORT = process.env.API_PORT || 8070;
const API_BIND_ADDR = process.env.API_BIND_ADDR || "0.0.0.0";

const app = Fastify({ logger: true });

// registering
app.register(userRoutes, { prefix: "/user" });
app.register(authRoutes, { prefix: "/auth" });
app.register(commonRoutes, { prefix: "/common" });
app.register(shortcutRoutes, { prefix: "/user/shortcut" });

app.listen(API_PORT, API_BIND_ADDR, async (err, address) => {
  if (err) {
    app.log.error(err);
    // process.exit(1);
  }

  await db.connectDB();
  console.info(`Server listening on ${address}`);
});

export default app;
