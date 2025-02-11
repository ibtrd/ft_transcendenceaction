import db from "../database.js";

// /v1/accounts routes
export default function accountsRoutes(fastify, opts, done) {

  // Get accounts table entries
  fastify.get("/", async function handler(request, reply) {
    const { limit = 30, offset = 0 } = request.query;
    // Cap limit to 100
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 30, 10), 100);
    // Prevent negative offset 
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

    return db.prepare(`SELECT * FROM accounts LIMIT ? OFFSET ?`).all(safeLimit, safeOffset);
  });

  // get the account associated to an email
  fastify.get("/:email", async function handler(request, reply) {
    const { email } = request.params;

    const account = db
      .prepare(`SELECT * FROM accounts WHERE email = ?`)
      .get(email);
    
    if (!account) {
      reply.status(404).send({ error: "Account not found" });
    }
    return account;
  });

  fastify.delete("/", async function handler(request, reply) {
    const { account_id } = request.query;
    db.prepare(`DELETE FROM accounts WHERE id = (?)`).run(account_id);
  });

  done();
}
