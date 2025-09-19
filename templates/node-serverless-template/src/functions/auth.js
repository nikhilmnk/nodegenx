'use strict';
import jwt from "jsonwebtoken";

export const handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const token = jwt.sign({ user: body.user || 'test' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  };
};