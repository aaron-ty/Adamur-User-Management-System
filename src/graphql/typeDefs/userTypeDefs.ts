// src/graphql/typeDefs/userTypeDefs.ts

import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    username : String!
    isVerified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
    verificationOTP: String!  # Add the OTP to the response
  }

  input RegisterInput {
    username : String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ResetPasswordInput {
    resetToken: String!
    newPassword: String!
  }

  type Query {
    getUser(id: ID!): User
    getAllUsers: [User!]!
  }


  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    verifyEmail(otp: String!): User!
    requestPasswordReset(email: String!): Boolean!  # New Mutation
    resetPassword(input: ResetPasswordInput!): User!
  }
`;