import db from "../database.js";

// /v1/google routes
export default function passwordRoutes(fastify, opts, done) {

  // Get password_auth table entries
  fastify.get("/", async function handler(request, reply) {
    const { limit = 30, offset = 0 } = request.query;

    // Cap limit to 100
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 30, 10), 100);
    // Prevent negative offset 
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

    return db.prepare(`SELECT * FROM password_auth LIMIT ? OFFSET ?`).all(safeLimit, safeOffset);
  });
  
  // Get the password based account associated to an email
  fastify.get("/:email", async function handler(request, reply) {
    const { email } = request.params;

    const account = db.prepare(`
      SELECT accounts.id, accounts.email, password_auth.*
      FROM accounts
      INNER JOIN password_auth
        ON accounts.id = password_auth.id
      WHERE auth_method = 'password_auth'
        AND email = ?
    `).get(email);

    if (!account) {
      reply.status(404).send({ error: "Account not found" });
    }
    return account;
  });

  // Create an email/password based account
  fastify.post("/", async function handler(request, reply) {
    const { email, hash, salt } = request.body;

    return db.transaction(() => {
      const accountId = db.prepare(`
        INSERT INTO accounts (email, auth_method)
        VALUES (?, 'password_auth')
        RETURNING id
      `).get(email);
    
      return db.prepare(`
        INSERT INTO password_auth (id, hash, salt)
        VALUES (?, ?, ?)
        RETURNING *
      `).get(accountId.id, hash, salt);
    })();
  });

  done();
}
