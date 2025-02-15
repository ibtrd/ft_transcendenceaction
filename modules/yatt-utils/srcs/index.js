import fetch, { HttpError } from "./http/fetch.js";
import { account_id, email, hash, password, salt } from "./schemas/credentials.js";
import setUpSwagger from "./swagger/setup.js";

const YATT = {
    fetch,
    HttpError,
    setUpSwagger,
};

export default YATT;

export const schemas = {
    property: {
        account_id,
        email,
        password,
        hash,
        salt
    }
}
