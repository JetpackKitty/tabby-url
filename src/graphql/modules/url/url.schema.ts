import { gql } from 'apollo-server-express';

export const schema = gql`
  scalar DateTime

  type ShortUrl {
    url: String
    createdAt: DateTime
  }
`;
