'use strict';

import build from "./app/builder.js";

const server = build();

server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
