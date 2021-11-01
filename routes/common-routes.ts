import bcrypt from "bcrypt";
import { models } from "mongoose";
import funcs from "../utils/funcs";
import jwtManager from "../utils/jwt-manager";
import { LooseObject } from "../utils/globals";

export async function commonRoutes(fastify: any, options: any) {
  // Simple Server Check
  fastify.get("/", (req: any, res: any, next: any) => {
    return funcs.sendError(res, "Server Check..", 200);
  });

  // User registeration
  fastify.post("/register", (req: any, res: any) => {
    let jwt_data: LooseObject, tokens: LooseObject;
    let { name, email, password, confirm_password } = req.body;

    if (!name || !password || !confirm_password) {
      return funcs.sendError(res, "Some fields are missing", 422);
    }

    if (password !== confirm_password) {
      return funcs.sendError(res, "Passwords must be same", 422);
    }

    password = funcs.genHash(password);
    models.User.create({ email, name, password })
      .then((user) => {
        jwt_data = {
          _id: user._id,
          isloggedIn: true,
          version: process.env.VERSION,
        };
        tokens = funcs.genJWT(jwt_data);
        user.last_login = new Date();
        user.refresh_token = tokens["refresh_token"];
        return user.save();
      })
      .then((_) => {
        return funcs.sendSuccess(
          res,
          jwt_data,
          201,
          tokens["access_token"],
          tokens["refresh_token"]
        );
      })
      .catch((err: any) => {
        return funcs.sendError(res, err.err_message || err, err.err_code);
      });
  });

  // User Login
  fastify.post("/login", (req: any, res: any, next: any) => {
    const { email, password } = req.body;
    let jwt_data: LooseObject, tokens: LooseObject;
    models.User.findOne({ email })
      .then((user) => {
        if (!user)
          throw {
            err_message: "Seems entered user details not exists!",
            err_code: 401,
          };

        const auth = bcrypt.compareSync(password, user.password);
        if (!auth)
          throw { err_message: "Incorrect credentials", err_code: 401 };

        jwt_data = {
          _id: user._id,
          isloggedIn: true,
          version: process.env.API_VERSION,
        };
        tokens = funcs.genJWT(jwt_data);
        user.last_login = new Date();
        user.refresh_token = tokens["refresh_token"];
        return user.save();
      })
      .then((_) => {
        return funcs.sendSuccess(
          res,
          jwt_data,
          201,
          tokens["access_token"],
          tokens["refresh_token"]
        );
      })
      .catch((err) => {
        return funcs.sendError(res, err.err_message || err, err.err_code);
      });
  });

  // User Logout
  fastify.delete(
    "/logout",
    { preHandler: jwtManager("access_token") },
    (req: any, res: any, next: any) => {
      const _id = req.jwt_data.data.id;

      models.User.findOneAndUpdate({ _id }, { $unset: { refresh_token: 1 } })
        .then((user) => {
          if (!user) throw { err_message: "User not exists!", err_code: 401 };

          return funcs.sendSuccess(res, "Loggedout Successfully !!", 200);
        })
        .catch(next);
    }
  );
}
