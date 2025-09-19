import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers/user.resolver";
import { authMiddleware } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
app.use(express.json());

// Apply auth middleware to all GraphQL requests
app.use(authMiddleware);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: req.user })
});

await server.start();
server.applyMiddleware({ app, path: "/graphql" });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/graphql`));
