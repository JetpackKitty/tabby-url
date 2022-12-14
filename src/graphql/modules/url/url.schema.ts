import { gql } from 'apollo-server-express';

export const schema = gql`
  scalar DateTime

  type ShortUrl {
    id: ID
    shortUrl: String
    longUrl: String
    createdAt: DateTime
  }

  input CreateShortUrlInput {
    longUrl: String!
  }

  extend type Query {
    shortUrl(id: ID!): ShortUrl
  }

  extend type Mutation {
    createShortUrl(input: CreateShortUrlInput!): ShortUrl
  }
`;
