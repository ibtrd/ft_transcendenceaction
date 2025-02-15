'use strict';

const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret) {
  console.error("Missing environment variable: JWT_SECRET");
  process.exit(1);
}

import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";
import fastifyFormbody from "@fastify/formbody";
import routes from "./routes.js";
import YATT from "yatt-utils";

export default function build(opts = {}) {
  const app = Fastify(opts);
  
  if (process.env.ENVIRONEMENT !== "production") {
    YATT.setUpSwagger(app, {
      info: {
        title: "Password Auth Service",
        description: "Service for password-based authentication",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:4022",
          description: "Password Auth (Public)",
        },
      ]
    });

    app.get("/swagger.json", async (_, reply) => {
      return reply.send(app.swagger());
    });
  }

  app.register(fastifyCookie, {
    secret: "my-secret", // Optional: for signing cookies
  });

  app.register(fastifyJWT, {
    secret: jwt_secret,
  });
  
  app.register(fastifyFormbody);

  app.register(routes);

  app.get("/ping", async function (request, reply) {
    reply.code(204).send();
  });

  return app;
}
