/* All the requried methods that used over and over again in entire API are decalred here */

// library imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// local imports
import { LooseObject } from "./globals";

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access secret";
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh secret";

const ACCESS_TKN_EXP_TIME = process.env.ACCESS_TKN_EXP_TIME || "1h";
const REFRESH_TKN_EXP_TIME = process.env.REFRESH_TKN_EXP_TIME || "28d";

// method to format Error response
const sendError = (res: any, err: any, resCode: number) => {
  err = err || "Internal Server Error";
  resCode = resCode || 500;

  if (typeof err !== "string") {
    console.log(err);
    err = err.message;
  }

  let response = {
    code: resCode,
    status: "error",
    message: err,
  };
  res.code(resCode);
  res.send(response);
};

// method to format Success response
const sendSuccess = (
  res: any,
  data?: any,
  resCode?: number,
  access_token?: string,
  refresh_token?: string
) => {
  resCode = resCode || 200;
  data = data === undefined ? {} : data;

  var response: LooseObject = {
    code: resCode,
    status: "success",
    data,
  };

  if (access_token) response["access_token"] = access_token;
  if (refresh_token) response["refresh_token"] = refresh_token;

  res.code(resCode);
  res.send(response);
};

// method to generate JsonWebToken (access_token, refresh_token)
const genJWT = (
  data: object,
  access_secret: string = JWT_ACCESS_SECRET,
  access_expire: string = ACCESS_TKN_EXP_TIME,
  refresh_secret: string = JWT_REFRESH_SECRET,
  refresh_expire: string = REFRESH_TKN_EXP_TIME
) => {
  let access_token = jwt.sign(data, access_secret, {
    expiresIn: access_expire,
  });
  let refresh_token = jwt.sign(data, refresh_secret, {
    expiresIn: refresh_expire,
  });

  return { access_token, refresh_token };
};

// method to generate hash for encrypting passwords using bcrypt
const genHash = (password: string) => {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// method to set tokens in headers
const genJWTFromHeaders = (req: any) => {
  let access_token = req.headers["x-my-access-token"] || "";
  let refresh_token = req.headers["x-my-refresh-token"] || "";
  return { access_token, refresh_token };
};

export = { genHash, genJWT, genJWTFromHeaders, sendSuccess, sendError };
