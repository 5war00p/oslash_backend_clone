import funcs from "../utils/funcs";

export async function commonRoutes(fastify: any, options: any) {
  // Simple Server Check
  fastify.get("/", (req: any, res: any, next: any) => {
    return funcs.sendSuccess(res, "Server Check..", 200);
  });
}
