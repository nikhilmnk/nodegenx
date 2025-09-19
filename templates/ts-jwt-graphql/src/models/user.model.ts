import { gql } from "apollo-server-express";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
