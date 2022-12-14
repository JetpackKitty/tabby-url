import { Resolvers } from '@generated/graphql-types';
import { ApolloError, UserInputError } from 'apollo-server-express';
import validUrl from 'valid-url';

import { UrlService } from '@services';

export const resolvers: Resolvers = {
  ShortUrl: {
    shortUrl: ({ id }) => `https://mechacat.app/link/${id}`,
  },
  Query: {
    shortUrl: async (root, { id }) => {
      try {
        const res = await UrlService.getShortUrl(id);

        return res;
      } catch (error) {
        throw new ApolloError(error as string);
      }
    },
  },
  Mutation: {
    createShortUrl: async (root, { input }) => {
      try {
        const { longUrl } = input;

        if (!validUrl.isWebUri(longUrl)) {
          throw new UserInputError('Long url is not a valid web URL');
        }

        const res = await UrlService.createShortUrl({
          longUrl,
        });

        return res;
      } catch (error) {
        throw new ApolloError(error as string);
      }
    },
  },
};
