import { client_id, client_secret, redirect_uri } from "./api_credendials.js";
import ft_fetch from "ft_fetch";
import { HttpError, BadGatewayError } from "ft_fetch";

export default function routes(fastify, opts, done) {
  fastify.get("/link", async function handler(request, reply) {
    const url = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=public`
    reply.redirect(url);
  });

  fastify.get("/callback", { schema: callbackSchema }, async function handler(request, reply) {
    const { code } = request.query;

    try {
      const user = await getIntraUser(code);
      try {
        const account = await ft_fetch(`http://credentials:3000/v1/fortytwo/${user.id}`);
        console.log(account);
        return await setJWT(fastify, reply, account.id);
      } catch (err) {
        if (err instanceof HttpError && err.statusCode == 404) {
          return await createAccount(fastify, reply, user);
        }
        throw err;
       }
    } catch (err) {
      if (err instanceof HttpError) { 
        return err.send(reply);
      }
      throw err;
    }
  });

  done();
}

async function getIntraUser(code) {
  const token = await generateUserToken(code);
  const user = await ft_fetch(`https://api.intra.42.fr/v2/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  if (!user || !user.email || !user.id) {
    throw new BadGatewayError();
  }
  return user;
}

async function generateUserToken(code) {
  const token = await ft_fetch(`https://api.intra.42.fr/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id,
      client_secret,
      code,
      redirect_uri
    })
  });
  if (!token || !token.access_token) {
    throw new BadGatewayError();
  }
  return token.access_token;
}

async function setJWT(fastify, reply, id) {
  const token = fastify.jwt.sign({ id }, { expiresIn: '15m' });
  reply.setCookie("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
  reply.code(200).send({
    message: "Authentication successful",
    account: { id }
  });
}

async function createAccount(fastify, reply, user) {
  const account = await ft_fetch(`http://credentials:3000/v1/fortytwo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      user_id: user.id
    }),
  });
  await setJWT(fastify, reply, account.id);
}

const callbackSchema = {
  query: {
    type: "object",
    required: ["code"],
    properties: {
      code: { type: "string" },
    },
  },
};
