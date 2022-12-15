import { gql } from 'apollo-server-express';

export const schema = gql`
  scalar DateTime

  type ShortUrl {
    """
    The ID of the short url is also used as the primary key. This omits the URL part of the short url
    e.g. https://mechacat.app/1234567890 would have an ID of 1234567890. This is the ID used to make
    query requests, NOT the shortUrl field.
    """
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
    """
    It is assumed that the longUrl is already validated by the client and will
    be a fully formed valid web url (e.g. https://[...])
    """
    longUrl: String!
  }

  extend type Query {
    """
    This ID here is just the ID of the short url, NOT the shortUrl field
    e.g. https://mechacat.app/1234567890 would have an ID of 1234567890
    """
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
