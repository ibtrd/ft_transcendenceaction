export const account_id = {
  type: "integer",
  minimum: 0,
  description: "The account id",
}

export const email = {
  type: "string",
  format: "email",
  description: "The account email address",
};

export const password = {
  type: "string",
  minLength: 8,
  maxLength: 24,
  description: "The account password, must be between 8 and 24 characters",
};

export const hash = {
  type: "string",
  minLength: 128,
  maxLength: 128,
  description: "The user's hashed password",
};

export const salt = {
  type: "string",
  minLength: 64,
  maxLength: 64,
  description: "The hashed password salt",
};
