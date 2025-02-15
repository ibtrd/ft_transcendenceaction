const limit = {
  type: "integer",
  minimum: 10,
  maximum: 100,
  default: 30,
  description: "Number of items to return (10-100)",
};

const offset = {
  type: "integer",
  minimum: 0,
  default: 0,
  description: "Number of items to skip",
};
