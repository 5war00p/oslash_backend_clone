import models from "../db/db-connector";
import funcs from "../utils/funcs";
import jwtManager from "../utils/jwt-manager";

export async function shortcutRoutes(fastify: any, options: any) {
  // List sll user shortcuts
  fastify.get(
    "/list",
    { preHandler: jwtManager("access_token") },
    async (req: any, res: any, next: any) => {
      const _id = req.jwt_data._id;
      if (!models.mongoose.Types.ObjectId.isValid(_id))
        return funcs.sendError(res, "Invalid UserID!", 403);

      models.User.findById(_id)
        .populate({
          path: "shortcuts",
          select: { createdAt: 0, __v: 0, user: 0 },
        })
        .select({ shortcuts: 1 })
        .then((userResults: any) => {
          if (!userResults) throw { message: "User not found", code: 404 };

          return funcs.sendSuccess(res, userResults);
        })
        .catch(next);
    }
  );

  // Search shortcuts based on keyword
  fastify.post(
    "/search",
    { preHandler: jwtManager("access_token") },
    async (req: any, res: any, next: any) => {
      const { user_id, search_key } = req.body;
      if (!models.mongoose.Types.ObjectId.isValid(user_id)) {
        return funcs.sendError(res, "Invalid Shortcut ID!", 403);
      }
      models.Shortcut.find({
        $and: [
          { user: user_id },
          {
            $or: [
              { shortlink: { $regex: search_key, $options: "i" } },
              { url: { $regex: search_key, $options: "i" } },
              { description: { $regex: search_key, $options: "i" } },
              { tags: { $regex: search_key, $options: "i" } },
            ],
          },
        ],
      })
        .select({ __v: 0, createdAt: 0, updatedAt: 0, user: 0 })
        .then((results: any) => {
          if (!results) {
            return funcs.sendSuccess(
              res,
              "No results found for your search keyword"
            );
          } else {
            return funcs.sendSuccess(res, results);
          }
        })
        .catch(next);
    }
  );

  // Create new shortcut
  fastify.post(
    "/new",
    { preHandler: jwtManager("access_token") },
    async (req: any, res: any, next: any) => {
      const { user_id, shortcut } = req.body;
      if (!models.mongoose.Types.ObjectId.isValid(user_id))
        return funcs.sendError(res, "Invalid User ID!", 403);

      if (!shortcut || !shortcut.shortlink || !shortcut.url) {
        return funcs.sendError(res, "Missing some required fields", 406);
      }
      models.Shortcut.create({
        user: user_id,
        shortlink: shortcut.shortlink,
        url: shortcut.url,
        description: shortcut.description,
        tags: shortcut.tags,
      })
        .then((shortcut: any) => {
          return models.User.findByIdAndUpdate(user_id, {
            $addToSet: { shortcuts: shortcut._id },
          });
        })
        .then((_: any) => {
          return funcs.sendSuccess(res, "Added Successfully!");
        })
        .catch(next);
    }
  );

  // Update an existed shortcut
  fastify.patch(
    "/update",
    { preHandler: jwtManager("access_token") },
    async (req: any, res: any, next: any) => {
      const { _id, shortlink, description, url, tags } = req.body;
      if (!models.mongoose.Types.ObjectId.isValid(_id)) {
        return funcs.sendError(res, "Invalid Shortcut ID!", 403);
      }
      models.Shortcut.findById(_id)
        .then((shortcut: any) => {
          if (!shortcut)
            throw { err_message: "Shortcut ID not found", err_code: 404 };

          if (url) shortcut.url = url;
          if (tags) shortcut.tags = tags;
          if (shortlink) shortcut.shortlink = shortlink;
          if (description) shortcut.description = description;

          return shortcut.save();
        })
        .then((shortcut: any) => {
          return funcs.sendSuccess(res, shortcut);
        })
        .catch(next);
    }
  );

  // Remove shortcut
  fastify.delete(
    "/remove",
    { preHandler: jwtManager("access_token") },
    async (req: any, res: any, next: any) => {
      const _id = req.body._id;
      if (!models.mongoose.Types.ObjectId.isValid(_id)) {
        return funcs.sendError(res, "Invalid Shortcut ID!", 403);
      }
      models.Shortcut.findByIdAndDelete(_id)
        .then((shortcut: any) => {
          if (!shortcut)
            throw { err_message: "Shortcut ID not found", err_code: 404 };

          return models.User.update(
            { _id: shortcut.user },
            {
              $pull: { shortcuts: _id },
            }
          );
        })
        .then((_: any) => {
          return funcs.sendSuccess(res, "Shortcut Deleted Successfully!");
        })
        .catch(next);
    }
  );
}
