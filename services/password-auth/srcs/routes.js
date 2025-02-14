import schema from "./shema.js";
import verifyPassword from "./verifyPassword.js";
import ft_fetch, { HttpError, UnauthorizedError } from "ft_fetch";

export default function passwordRoutes(fastify, opts, done) {
  fastify.post("/", { schema }, async function handler(request, reply) {
    const { email, password } = request.body;
    try {
      const account = await ft_fetch(
        `http://credentials:3000/v1/password/${email}`
      );
      if (await verifyPassword(password, account.hash, account.salt)) {
        const token = fastify.jwt.sign({ id: account.id }, { expiresIn: '15m' });
        const decoded = fastify.jwt.decode(token);
        reply.setCookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        return reply.send({
          token, expire_at: new Date(decoded.exp * 1000).toISOString()
        });
      }
    } catch (err) {
      if (err instanceof HttpError && err.statusCode !== 404) {
        return err.send(reply);
      }
      throw err;
    }
    new UnauthorizedError().send(reply);
  });

  done();
}
