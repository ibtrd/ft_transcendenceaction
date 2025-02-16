"user strict";

import responseBodyProperties from "../properties/reponse-body.js";

const reponseBodyObjects = {
  errorBody: {
    statusCode: responseBodyProperties.statusCode,
    code: responseBodyProperties.code,
    error: responseBodyProperties.error,
    message: responseBodyProperties.message,
  },
};

export default reponseBodyObjects;
