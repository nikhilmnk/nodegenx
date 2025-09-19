export const authenticate = (username: string, password: string) => {
  // Dummy authentication
  return username === "admin" && password === "password";
};