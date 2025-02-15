'use strict';

import Fastify from "fastify";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";

const services = [
  { name: "Credentials", url: "http://credentials:3000/swagger.json" },
  { name: "Password Auth", url: "http://password-auth:3000/swagger.json" },
];


async function fetchServiceSchemas() {
  const schemas = [];
  for (const service of services) {
    try {
      const response = await fetch(service.url);
      const data = await response.json();
      schemas.push(data);
    } catch (error) {
      console.error(`⚠️ Erreur lors du chargement de ${service.name}`, error.message);
    }
  }
  return schemas;
}


async function generateMergedSchema() {
  const schemas = await fetchServiceSchemas();
  return {
    openapi: {
      info: {
        title: "API Gateway",
        description: "Documentation centralisée",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:4000" }],
      paths: Object.assign({}, ...schemas.map((s) => s.paths)),
    }
  };
}



export default function build(opts = {}) {
  const app = Fastify(opts);

  generateMergedSchema().then(schema => console.log(schema));

  app.register(fastifySwagger, {
    
  });
  
  app.register(fastifySwaggerUi, {
    routePrefix: "/api-docs",
  });

  app.get("/swagger.json", async (req, reply) => {
    const schema = await generateMergedSchema();
    reply.send(schema);
  });


  app.get("/ping", async function (request, reply) {
    reply.code(204).send();
  });

  return app;
}
