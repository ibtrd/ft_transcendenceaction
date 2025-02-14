const emailSchema = {
  type: "string",
  format: "email",
  description: "The user's email address",
};

const hashSchema = {
  type: "string",
  minLength: 128,
  maxLength: 128,
  description: "The user's hashed password",
};

const saltSchema = {
  type: "string",
  minLength: 64,
  maxLength: 64,
  description: "The hased password salt",
};

const schema = {
  body: {
    type: "object",
    properties: {
      email: emailSchema,
      hash: hashSchema,
      salt: saltSchema,
    },
    required: ["email", "hash", "salt"],
  },
};

export default schema;
