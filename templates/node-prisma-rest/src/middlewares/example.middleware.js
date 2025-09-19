export const exampleMiddleware = (req, res, next) => {
  console.log('Middleware called');
  next();
};