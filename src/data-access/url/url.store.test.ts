import mockKnex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { camelizeKeys as camelize } from 'humps';

import UrlStore from './url.store';

const TableNames = {
  SHORT_URLS: 'short_urls',
};

jest.mock('@db/knex', () => {
  return mockKnex({ client: MockClient });
});

describe('url.store', () => {
  let tracker: Tracker;

  beforeAll(() => {
    tracker = getTracker();
  });

  afterEach(() => {
    tracker.reset();
  });

  describe('getShortUrl', () => {
    test('it should get a given short url', async () => {
      const mockShortUrl = {
        short_url: 'abcd1234',
        created_at: '2022-12-14 07:42:37',
        long_url: 'https://normalcat.com',
      };
      tracker.on.select(TableNames.SHORT_URLS).response(mockShortUrl);

      const res = await UrlStore.getShortUrl('abcd1234');

      expect(res).toEqual(camelize(mockShortUrl));
    });

    test('it should return undefined if short url is not found', async () => {
      tracker.on.select(TableNames.SHORT_URLS).response([]);

      const res = await UrlStore.getShortUrl('idNotFound');

      expect(res).toBeUndefined();
    });
  });
});
