import hashPassword from "./crypt.js";
import schema from "./shema.js";
import { AUTH_EMAIL_IN_USE } from "../errors.js";

export default function passwordRoutes(fastify, opts, done) {
  // POST route to create a new password based account
  fastify.post("/", { schema } , async function handler(request, reply) {
    const { email, password } = request.body;

    try {
      const response = await fetch(`http://credentials:3000/v1/password/${email}`);
      if (response.status !== 404) {
        reply.code(409).send(AUTH_EMAIL_IN_USE);
      }
    } catch (err) {
      console.error(err);
      reply.code(500).send();
    }
    
    const hash = await hashPassword(password);
    // Add account to database
    try {
      const response = await fetch(`http://credentials:3000/v1/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          hash: hash.hash,
          salt: hash.salt,
        }),
      });
      if (!response.ok) {
        reply.code(500).send();
      } else {
        const data = await response.json();
        let body = {
          statusCode: 200,
          message: "Account created successfully",
          account_id: data.id,
        }
        //TODO: add authentification
        console.log('ACCOUNT CREATED:', { id: data.id, email: email, auth: 'password'});
        reply.send(body);
      }
    } catch (err) {
      console.error(err);
      reply.code(500).send();
    }
  });

  done();
}
