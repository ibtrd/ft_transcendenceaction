const schema = {
  body: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
      },
      user_id: {
        type: "integer",
        minimum: 1,
      },
    },
    required: ["email", "user_id"],
  },
};

export default schema;