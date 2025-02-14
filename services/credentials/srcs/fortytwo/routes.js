import db from "../database.js";
import schema from "./shema.js";

// /v1/password routes
export default function fortytwoRoutes(fastify, opts, done) {
  // Get fortytwo_auth table entries
  fastify.get("/", async function handler(request, reply) {
    const { limit = 30, offset = 0 } = request.query;

    // Cap limit to 100
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 30, 10), 100);
    // Prevent negative offset
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

    return db
      .prepare(`SELECT * FROM fortytwo_auth LIMIT ? OFFSET ?`)
      .all(safeLimit, safeOffset);
  });

  // Get the account associated to a 42intra user_id
  fastify.get("/:user_id", async function handler(request, reply) {
    const { user_id } = request.params;

    const account = db
      .prepare(
        `
      SELECT accounts.id, accounts.email, fortytwo_auth.*
      FROM accounts
      INNER JOIN fortytwo_auth
        ON accounts.id = fortytwo_auth.id
      WHERE auth_method = 'fortytwo_auth'
        AND fortytwo_auth.user_id = ?;
    `
      )
      .get(user_id);

    if (!account) {
      reply.status(404).send({ error: "Account not found" });
    }
    return account;
  });

  // Create a fortytwo auth based account
  fastify.post("/", { schema }, async function handler(request, reply) {
    const { email, user_id } = request.body;

    try {
      const result = db.transaction(() => {
        const accountId = db
          .prepare(
            `
          INSERT INTO accounts (email, auth_method)
          VALUES (?, 'fortytwo_auth')
          RETURNING id
        `
          )
          .get(email);

        return db
          .prepare(
            `
          INSERT INTO fortytwo_auth (id, user_id)
          VALUES (?, ?)
          RETURNING *
        `
          )
          .get(accountId.id, user_id);
      })();
      return reply.status(201).send(result);
    } catch (err) {
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return reply.code(409).send({
          statusCode: 409,
          code: "AUTH_EMAIL_IN_USE",
          error: "Email Already In Use",
          message: `This email is already associated with an account.`,
        });
      }
      throw err;
    }
  });

  done();
}
