export const AUTH_EMAIL_IN_USE = {
  statusCode: 409,
  code: "AUTH_EMAIL_IN_USE",
  error: "Email Already In Use",
  message:
    "The email address you provided is already associated with an account. Please try the following options:",
  details: [
    "If you've previously registered, try logging in instead.",
    "If you use a different authentication method (e.g., Google, 42Intra), try signing in with that method.",
    "If you believe this is an error, please contact our support team for assistance.",
  ],
};
