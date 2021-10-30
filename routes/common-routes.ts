export async function commonroutes(fastify: any, options: any) {
  fastify.get("/", async (req: any, res: any) => {
    /*
      Sample route
    */

    return { message: "This is sample route..!" };
  });
}
