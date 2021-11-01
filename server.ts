require("dotenv").config();

// Imports from packages
import Fastify from "fastify";

// Local imports
import db from "./db/db-connector";
import { commonRoutes } from "./routes/common-routes";
import { userRoutes } from "./routes/user-routes";
import { shortcutRoutes } from "./routes/shortcut-routes";

const API_PORT = process.env.API_PORT || 8070;
const API_BIND_ADDR = process.env.API_BIND_ADDR || "0.0.0.0";

const app = Fastify({ logger: true });

// registering
app.register(commonRoutes, { prefix: "/common" });
app.register(userRoutes, { prefix: "/user" });
app.register(shortcutRoutes, { prefix: "/user/shortcut" });

app.listen(API_PORT, API_BIND_ADDR, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Connceting to DB
  db.connectDB();
  console.info(`Server listening on ${address}`);
});

export default app;
