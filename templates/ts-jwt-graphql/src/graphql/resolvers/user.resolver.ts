import { User } from "../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let users: User[] = [];

export const resolvers = {
  Query: {
    users: () => users,
    me: (_: any, __: any, context: any) => context.user || null,
  },
  Mutation: {
    register: async (_: any, { name, email, password }: any) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = { id: `${Date.now()}`, name, email, password: hashed };
      users.push(user);
      return user;
    },
    login: async (_: any, { email, password }: any) => {
      const user = users.find(u => u.email === email);
      if (!user) throw new Error("User not found");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Invalid password");

      return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    }
  }
};
