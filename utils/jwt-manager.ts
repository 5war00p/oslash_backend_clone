/* JWT Manager that verifies & validates the tokens */

// library imports
const jwt = require("jsonwebtoken");

//local imports
const funcs = require("./funcs");

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access secret";
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh secret";

export = (type: String) => {
  return (req: any, res: any, next: any) => {
    const { access_token, refresh_token } = funcs.genJWTFromHeaders(req);
    let auth_token, JWT_SECRET;

    if (type === "refresh_token") {
      auth_token = refresh_token;
      JWT_SECRET = JWT_REFRESH_SECRET;
    } else if (type === "access_token") {
      auth_token = access_token;
      JWT_SECRET = JWT_ACCESS_SECRET;
    }

    if (!auth_token)
      return funcs.sendError(res, "Authentication token not provided!", 401);

    jwt.verify(auth_token, JWT_SECRET, (err: any, data: any) => {
      if (err) {
        if (err.name === "TokenExpiredError")
          throw { err_message: "Authentication token expired!", err_code: 401 };
        throw { err_message: "Invalid authentication token!", err_code: 401 };
      }

      if (data.version !== process.env.API_VERSION)
        throw { err_message: "Token Resetted!", err_code: 401 };

      delete data["exp"];
      delete data["iat"];
      req.jwt_data = data;

      next();
    });
  };
};
