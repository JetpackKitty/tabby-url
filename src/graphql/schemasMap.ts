import { gql } from 'apollo-server-express';
import 'graphql-import-node';

import { schema as urlSchema } from './modules/url';

import { typeDefs as scalarTypes } from 'graphql-scalars';
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolversMap';
import { GraphQLSchema } from 'graphql';

const types = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [types, ...scalarTypes, urlSchema],
  resolvers,
});

export default schema;
