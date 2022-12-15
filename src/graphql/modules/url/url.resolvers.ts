import { Resolvers } from '@generated/graphql-types';
import { ApolloError, UserInputError } from 'apollo-server-express';
import validUrl from 'valid-url';

import { UrlService } from '@services';
import { ShortUrlModel } from 'src/models/url.model';

export const resolvers: Resolvers = {
  ShortUrl: {
    shortUrl: ({ id }) => `https://mechacat.app/link/${id}`,
  },
  Query: {
    shortUrl: async (root, { id }) => {
      try {
        const res = (await UrlService.getShortUrl(id)) as ShortUrlModel;

        return res;
      } catch (error) {
        throw new ApolloError(error as string);
      }
    },
    shortUrls: async (root, { limit, offset }, { isAuthenticated }) => {
      try {
        // This would be an auth protected query in a real world scenario
        if (!isAuthenticated) {
          throw new ApolloError('Not authenticated');
        }

        const res = (await UrlService.listShortUrls({
          limit: limit || 50,
          offset: offset || 0,
        })) as ShortUrlModel[];

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

    deleteShortUrl: async (root, { id }, { isAuthenticated }) => {
      try {
        // This would be an auth protected query in a real world scenario
        if (!isAuthenticated) {
          throw new ApolloError('Not authenticated');
        }

        const res = await UrlService.deleteShortUrl(id);

        return {
          success: res > 0,
          affectedRows: res,
        };
      } catch (error) {
        throw new ApolloError(error as string);
      }
    },
  },
};
