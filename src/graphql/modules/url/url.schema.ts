import { gql } from 'apollo-server-express';

export const schema = gql`
  scalar DateTime

  type ShortUrl {
    id: ID
    shortUrl: String
    longUrl: String
    createdAt: DateTime
  }

  type DeleteShortUrlResponse {
    success: Boolean
    affectedRows: Int
  }

  input CreateShortUrlInput {
    longUrl: String!
  }

  extend type Query {
    shortUrl(id: ID!): ShortUrl

    """
    This is to demonstrate using context for checking authentication in a protected endpoint
    """
    shortUrls(limit: Int, offset: Int): [ShortUrl!]
  }

  extend type Mutation {
    createShortUrl(input: CreateShortUrlInput!): ShortUrl

    """
    This is to demonstrate returning a custom response type
    """
    deleteShortUrl(id: ID!): DeleteShortUrlResponse
  }
`;
