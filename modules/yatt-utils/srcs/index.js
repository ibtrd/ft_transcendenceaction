'use strict';

import fetch, { HttpError } from "./http/fetch.js";
import reponseBodyObjects from "./schemas/objects/reponse-body.js";

import credentialsProperties from "./schemas/properties/credentials.js";
import responseBodyProperties from "./schemas/properties/reponse-body.js";
import sqlProperties from "./schemas/properties/sql.js";
import setUpSwagger from "./swagger/setup.js";

const YATT = {
    fetch,
    HttpError,
    setUpSwagger,
};

export default YATT;

export const properties = {
    ...credentialsProperties,
    ...sqlProperties,
    ...responseBodyProperties
}

export const objects = {
    ...reponseBodyObjects
}
