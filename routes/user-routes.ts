import models from "../db/db-connector";
import funcs from "../utils/funcs";
import jwtManager from "../utils/jwt-manager";

export async function userRoutes(fastify: any, options: any) {
  // Profile route
  fastify.get(
    "/profile",
    { preValidation: jwtManager("access_token") },
    async (req: any, res: any, next: any) => {
      const _id = req.jwt_data._id;
      if (!models.mongoose.Types.ObjectId.isValid(_id))
        return funcs.sendError(res, "Invalid UserID!", 403);

      models.User.findById(_id)
        .select({ email: 1, name: 1, shortcuts: 1 })
        .then((user: any) => {
          if (!user) return funcs.sendError(res, "User not found", 404);
          else return funcs.sendSuccess(res, user);
        })
        .catch(next);
    }
  );
}
