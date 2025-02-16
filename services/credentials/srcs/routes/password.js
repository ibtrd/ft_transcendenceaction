'use strict';

import db from "../app/database.js";
import { properties } from "yatt-utils";

export default function router(fastify, opts, done) {
  let schema;

  schema = {
    querystring: {
      type: 'object',
      properties: {
        limit: properties.limit,
        offset: properties.offset,
      }
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            // id: { type: 'integer' },
            // username: { type: 'string' },
            // email: { type: 'string', format: 'email' },
            // password_hash: { type: 'string' },
            // created_at: {  },
            // updated_at: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'username', 'email', 'password_hash', 'created_at', 'updated_at']
        }
      }
    }
  };
  // Get password_auth table entries
  fastify.get("/", async function handler(request, reply) {
    const { limit, offset } = request.query;

    // Cap limit to 100
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 30, 10), 100);
    // Prevent negative offset
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

    return db
      .prepare(`SELECT * FROM password_auth LIMIT ? OFFSET ?`)
      .all(safeLimit, safeOffset);
  });

  // Get the password based account associated to an email
  fastify.get("/:email", async function handler(request, reply) {
    const { email } = request.params;

    const account = db
      .prepare(
        `
      SELECT accounts.account_id, accounts.email, password_auth.*
      FROM accounts
      INNER JOIN password_auth
        ON accounts.account_id = password_auth.account_id
      WHERE auth_method = 'password_auth'
        AND email = ?
    `
      )
      .get(email);

    if (!account) {
      reply.status(404).send({ error: "Account not found" });
    }
    return account;
  });

  // Create an email/password based account
  schema = {
    body: {
      type: "object",
      properties: {
        email: properties.email,
        hash: properties.hash,
        salt: properties.salt,
      },
      required: ["email", "hash", "salt"],
    },
  };
  
  fastify.post("/", { schema }, async function handler(request, reply) {
    const { email, hash, salt } = request.body;

    try {
      const result = db.transaction(() => {
        const account = db
          .prepare(
            `
          INSERT INTO accounts (email, auth_method)
          VALUES (?, 'password_auth')
          RETURNING account_id
        `
          )
          .get(email);

        return db
          .prepare(
            `
          INSERT INTO password_auth (account_id, hash, salt)
          VALUES (?, ?, ?)
          RETURNING *
        `
          )
          .get(account.account_id, hash, salt);
      })();
      return reply.status(201).send(result);
    } catch (err) {
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return reply.code(409).send({
          statusCode: 409,
          code: "AUTH_EMAIL_IN_USE",
          error: "Email Already In Use",
          message: `This email is already associated with an account`,
        });
      }
      console.error(err);
      throw err;
    }
  });

  done();
}
