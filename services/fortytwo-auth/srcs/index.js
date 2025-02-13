import Fastify from 'fastify';
const fastify = Fastify();

import fastifyFormbody from '@fastify/formbody';
fastify.register(fastifyFormbody);

import fastifyCookie from '@fastify/cookie';
fastify.register(fastifyCookie);

import fastifyJWT from '@fastify/jwt';
import { jwt_secret } from './env.js';
fastify.register(fastifyJWT, {
  secret: jwt_secret,
  cookie: {
    cookieName: 'access_token',
    signed: false
  }
})

import routes from './routes.js';
fastify.register(routes);

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
