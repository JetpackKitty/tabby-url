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
      const mockDbResponse = {
        id: 'abcd123',
        created_at: '2022-12-14 07:42:37',
        long_url: 'https://normalcat.com',
      };
      tracker.on.select(TableNames.SHORT_URLS).response(mockDbResponse);

      const res = await UrlStore.getShortUrl('abcd123');

      const selectHistory = tracker.history.select;

      const expectedResult = camelize(mockDbResponse);

      expect(selectHistory).toHaveLength(1);
      expect(selectHistory[0].method).toEqual('select');
      expect(selectHistory[0].bindings).toEqual([
        'abcd123', // short_url
        1, // first
      ]);

      expect(res).toEqual(expectedResult);
    });

    test('it should return undefined if short url is not found', async () => {
      tracker.on.select(TableNames.SHORT_URLS).response([]);

      const res = await UrlStore.getShortUrl('idNotFound');

      expect(res).toBeUndefined();
    });
  });

  describe('createShortUrl', () => {
    test('it should create a new short url entry', async () => {
      const mockInput = {
        longUrl: 'https://longestcat.com',
        id: 'exbc238',
      };

      const mockDbResponse = {
        id: 'exbc238',
        created_at: '2022-12-14 07:42:37',
        long_url: mockInput.longUrl,
      };

      tracker.on.select(TableNames.SHORT_URLS).response(mockDbResponse);
      tracker.on.insert(TableNames.SHORT_URLS).response([mockDbResponse.id]);

      const res = await UrlStore.createShortUrl(mockInput);

      const expectedBindings = [mockInput.id, mockInput.longUrl];

      const expectedResult = camelize(mockDbResponse);

      const insertHistory = tracker.history.insert;

      expect(insertHistory).toHaveLength(1);
      expect(insertHistory[0].method).toEqual('insert');
      expect(insertHistory[0].bindings).toEqual(expectedBindings);

      expect(res).toEqual(expectedResult);
    });

    test('it should reject if there is an error or conflict', async () => {
      const mockInput = {
        longUrl: 'https://longestcat.com',
        id: 'exbc238',
      };

      const mockDbResponse = {
        id: 'exbc238',
        created_at: '2022-12-14 07:42:37',
        long_url: mockInput.longUrl,
      };

      tracker.on.insert(TableNames.SHORT_URLS).simulateError('Error from db');

      try {
        const res = await UrlStore.createShortUrl(mockInput);
      } catch (error) {
        expect((error as Error).message).toContain('Error from db');
      }
    });
  });

  describe('listShortUrls', () => {
    test('it should list all short urls', async () => {
      const mockDbResponse = [
        {
          id: 'abcd123',
          created_at: '2022-12-14 07:42:37',
          long_url: 'https://normalcat.com',
        },
        {
          id: 'exbc238',
          created_at: '2022-12-14 07:42:37',
          long_url: 'https://longestcat.com',
        },
      ];
      tracker.on.select(TableNames.SHORT_URLS).response(mockDbResponse);

      const res = await UrlStore.listShortUrls();

      const selectHistory = tracker.history.select;

      const expectedResult = camelize(mockDbResponse);

      expect(selectHistory).toHaveLength(1);
      expect(selectHistory[0].method).toEqual('select');
      expect(selectHistory[0].bindings).toEqual([50]);

      expect(res).toEqual(expectedResult);
    });
  });

  describe('deleteShortUrl', () => {
    test('it should delete a short url', async () => {
      tracker.on.delete(TableNames.SHORT_URLS).response(1);

      const res = await UrlStore.deleteShortUrl('abcd123');

      const deleteHistory = tracker.history.delete;

      expect(deleteHistory).toHaveLength(1);
      expect(deleteHistory[0].method).toEqual('delete');
      expect(deleteHistory[0].bindings).toEqual(['abcd123']);
    });
  });
});
