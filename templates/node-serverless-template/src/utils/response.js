'use strict';
export const success = (body) => ({ statusCode: 200, body: JSON.stringify(body) });
export const error = (message, code = 500) => ({ statusCode: code, body: message });