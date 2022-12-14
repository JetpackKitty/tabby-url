import { customAlphabet } from 'nanoid';
import { UrlStore } from '@data-access';

import UrlService from './url.service';

jest.mock('nanoid', () => ({
  customAlphabet: jest.fn(() => {
    return () => 'tes2790';
  }),
}));
jest.mock('@data-access');

const nanoid = customAlphabet('1234567890abcdef', 7);

describe('url.service', () => {
  describe('getShortUrl', () => {
    test('it should retrieve the short url', async () => {
      const mockInput = 'adad328';

      const mockCreated = {
        longUrl: 'long328',
        id: mockInput,
        createdAt: '2022-12-14 07:42:37',
      };

      (UrlStore.getShortUrl as jest.Mock).mockResolvedValue(mockCreated);

      const res = await UrlService.getShortUrl(mockInput);

      expect(res).toEqual(mockCreated);
    });
  });

  describe('generateIdString', () => {
    test('it should generate a string of length 7 characters', async () => {
      const nanoid = customAlphabet('1234567890abcdef', 7);
      const generatedId = nanoid();

      const res = UrlService.generateIdString();

      expect(res).toBe(generatedId);
      expect(res).toHaveLength(7);
    });
  });

  describe('generateUniqueShortUrl', () => {
    test('it should generate a unique short url', async () => {
      const nanoid = customAlphabet('1234567890abcdef', 7);
      const generatedId = nanoid();

      const spy = jest
        .spyOn(UrlService, 'generateIdString')
        .mockReturnValue(generatedId);

      (UrlStore.getShortUrl as jest.Mock).mockResolvedValue(undefined);

      const res = await UrlService.generateUniqueId();

      expect(res).toBe(generatedId);

      spy.mockRestore();
    });

    test('it should retry if the generated url already exists', async () => {
      const nanoid = customAlphabet('1234567890abcdef', 7);
      const generatedId = nanoid();

      const spy = jest
        .spyOn(UrlService, 'generateIdString')
        .mockReturnValue(generatedId);

      const mockDbShortUrl = {
        short_url: generatedId,
      };

      (UrlStore.getShortUrl as jest.Mock)
        .mockResolvedValueOnce(mockDbShortUrl)
        .mockResolvedValueOnce(mockDbShortUrl)
        .mockResolvedValueOnce(undefined);

      const res = await UrlService.generateUniqueId();

      expect(spy).toHaveBeenCalledTimes(3);
      expect(res).toBe(generatedId);

      spy.mockRestore();
    });

    test('it should reject if the maximum number of retries has been reached', async () => {
      const generatedId = nanoid();

      const spy = jest
        .spyOn(UrlService, 'generateIdString')
        .mockReturnValue(generatedId);

      (UrlStore.getShortUrl as jest.Mock).mockResolvedValue({
        short_url: generatedId,
      });

      try {
        const res = await UrlService.generateUniqueId();
      } catch (error) {
        expect(error as string).toBe(
          'Exceeded maximum retries, please report this issue.',
        );

        expect(spy).toHaveBeenCalledTimes(5);
      }

      spy.mockRestore();
    });
  });

  describe('createShortUrl', () => {
    test('it should generate the url and save it to store', async () => {
      const generatedId = nanoid();
      const mockInput = {
        longUrl: 'https://ginger.root',
      };

      const mockCreated = {
        longUrl: mockInput.longUrl,
        id: generatedId,
        createdAt: '2022-12-14 07:42:37',
      };

      const spy = jest
        .spyOn(UrlService, 'generateUniqueId')
        .mockResolvedValue(generatedId);

      (UrlStore.createShortUrl as jest.Mock).mockResolvedValue(mockCreated);

      const res = await UrlService.createShortUrl(mockInput);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(UrlStore.createShortUrl).toHaveBeenCalledWith({
        longUrl: mockInput.longUrl,
        id: generatedId,
      });
      expect(res).toEqual(mockCreated);

      spy.mockRestore();
    });
  });
});
