'use strict';
import jwt from "jsonwebtoken";

export const authMiddleware = (handler) => async (event) => {
  const token = event.headers?.Authorization?.split(" ")[1];
  if (!token) return { statusCode: 401, body: 'Unauthorized' };

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return handler(event);
  } catch (err) {
    return { statusCode: 403, body: 'Forbidden' };
  }
};