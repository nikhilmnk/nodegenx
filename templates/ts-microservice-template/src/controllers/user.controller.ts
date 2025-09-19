import { getUser } from "../services/userService";

export const getUserController = (req, res) => {
  const user = getUser(req.params.id);
  res.json(user);
};