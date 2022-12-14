import { gql, ApolloServer } from 'apollo-server-express';
import schema from '@graphql/schemasMap';
import { UrlService } from '@services';

jest.mock('@services');

const testServer = new ApolloServer({
  schema,
});

describe('url.schema', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('shortUrl', () => {
    test('it should return the short url', async () => {
      const mockResponse = {
        id: 'tes3898',
        shortUrl: 'https://mechacat.app/link/tes3898',
        longUrl: 'https://ginger.root/loneliness',
        createdAt: '2022-12-14T03:40:18.000Z',
      };

      (UrlService.getShortUrl as jest.Mock).mockResolvedValue(mockResponse);

      const result = await testServer.executeOperation({
        query: gql`
          query ShortUrlQuery($id: ID!) {
            shortUrl(id: $id) {
              id
              shortUrl
              longUrl
              createdAt
            }
          }
        `,
        variables: {
          id: 'tes3898',
        },
      });

      expect(UrlService.getShortUrl).toBeCalledWith('tes3898');
      expect(result.errors).toBeUndefined();
      expect(result.data?.shortUrl).toEqual(mockResponse);
    });
  });
  describe('createShortUrl', () => {
    test('it should create the short url', async () => {
      const mockResponse = {
        id: 'tes3898',
        shortUrl: 'https://mechacat.app/link/tes3898',
        longUrl: 'https://ginger.root/loneliness',
        createdAt: '2022-12-14T03:40:18.000Z',
      };

      (UrlService.createShortUrl as jest.Mock).mockResolvedValue(mockResponse);

      const result = await testServer.executeOperation({
        query: gql`
          mutation CreateShortUrl($input: CreateShortUrlInput!) {
            createShortUrl(input: $input) {
              createdAt
              longUrl
              shortUrl
              id
            }
          }
        `,
        variables: {
          input: {
            longUrl: 'https://ginger.root/loneliness',
          },
        },
      });

      expect(UrlService.createShortUrl).toBeCalledWith({
        longUrl: 'https://ginger.root/loneliness',
      });
      expect(result.errors).toBeUndefined();
      expect(result.data?.createShortUrl).toEqual(mockResponse);
    });

    test('it should reject an invalid url', async () => {
      const mockResponse = {
        id: 'tes3898',
      };

      (UrlService.createShortUrl as jest.Mock).mockResolvedValue(mockResponse);

      const result = await testServer.executeOperation({
        query: gql`
          mutation CreateShortUrl($input: CreateShortUrlInput!) {
            createShortUrl(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            longUrl: 'gg.com',
          },
        },
      });

      expect(UrlService.createShortUrl).not.toHaveBeenCalled();
      expect(result.errors).toHaveLength(1);
    });
  });
});
