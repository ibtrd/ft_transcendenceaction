import hashPassword from "./crypt.js";
import schema from "./shema.js";
import ft_fetch, { ConflictError, HttpError } from "ft_fetch";


export default function routes(fastify, opts, done) {
  // POST route to create a new password based account
  fastify.post("/", { schema } , async function handler(request, reply) {
    const { email, password } = request.body;
    
    const hash = await hashPassword(password);
    // Add account to database
    try {
      const newAccount = await ft_fetch(`http://credentials:3000/password`, {
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
      console.log('ACCOUNT CREATED:', { id: newAccount.id, email: email, auth: 'password'});
      reply.send({
        statusCode: 200,
        code: 'SUCESSFULL_REGISTRATION',
        message: "Your account has been created",
        account: {
          id: newAccount.id,
          email: email,
        }
      });
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.statusCode == 409) {
          err.message = "The email address you provided is already associated with an account";
        }
        return err.send(reply);
      }
      throw err;
    }
  });

  done();
}
