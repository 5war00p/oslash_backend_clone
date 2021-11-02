import bcrypt from "bcrypt";
import { models } from "mongoose";
import funcs from "../utils/funcs";
import jwtManager from "../utils/jwt-manager";
import { LooseObject, EMAIL_REGEXP } from "../utils/globals";

export async function authRoutes(fastify: any, options: any) {
  // User registeration
  fastify.post("/register", (req: any, res: any) => {
    let jwt_data: LooseObject, tokens: LooseObject;
    let { name, email, password, confirm_password } = req.body;

    if (!name || !password || !confirm_password || !email)
      return funcs.sendError(res, "Some fields are missing", 422);

    if (!EMAIL_REGEXP.test(email))
      return funcs.sendError(res, "Invalid Email", 422);

    if (password !== confirm_password)
      return funcs.sendError(res, "Passwords must be same", 422);

    password = funcs.genHash(password);
    models.User.create({ email, name, password })
      .then((user) => {
        jwt_data = {
          _id: user._id,
          isLoggedIn: true,
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
      .catch((err: any) => {
        if (err.code === 11000)
          return funcs.sendError(res, "Email already exists", 409);
        else return funcs.sendError(res, err.err_message || err, err.err_code);
      });
  });

  // User Login
  fastify.post("/login", (req: any, res: any, next: any) => {
    const { email, password } = req.body;

    if (!password || !email)
      return funcs.sendError(res, "Some fields are missing", 422);

    if (!EMAIL_REGEXP.test(email))
      return funcs.sendError(res, "Invalid Email", 422);

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
          isLoggedIn: true,
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
      const _id = req.jwt_data._id;

      models.User.findOneAndUpdate({ _id }, { $unset: { refresh_token: 1 } })
        .then((user) => {
          if (!user) throw { err_message: "User not exists!", err_code: 404 };

          return funcs.sendSuccess(res, "Loggedout Successfully !!", 200);
        })
        .catch(next);
    }
  );
}
