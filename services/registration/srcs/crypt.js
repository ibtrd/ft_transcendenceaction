import crypto from "crypto";

const pepper = process.env.PASSWORD_PEPPER
if (!pepper) {
  console.error("Missing environment variable: PASSWORD_PEPPER");
  process.exit(1);
}

/**
 * Salt generation
 * @returns {string} A random salt
 */
function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Password hashing
 * @param {string} password - The password to hash
 * @returns {{hash: string, salt: string}} The resuling hash and it's associated salt
 */
export default async function hashPassword(password) {
  const salt = generateSalt();
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password + pepper, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });

  return {
    hash: derivedKey.toString("hex"),
    salt: salt,
  };
}
