import { customAlphabet } from 'nanoid';
import { UrlStore } from '@data-access';

import UrlService from './url.service';

jest.mock('nanoid', () => ({
  customAlphabet: jest.fn(() => {
    return () => 'tes2790';
  }),
}));
jest.mock('@data-access');

describe('url.service', () => {
  const nanoid = customAlphabet('1234567890abcdef', 7);

  describe('generateShortId', () => {
    test('it should generate a string of length 7 characters', async () => {
      const generatedId = nanoid();

      const res = UrlService.generateShortId();

      expect(res).toBe(generatedId);
      expect(res).toHaveLength(7);
    });
  });

  describe('generateUniqueShortUrl', () => {
    test('it should generate a unique short url', async () => {
      const generatedId = nanoid();

      const spy = jest
        .spyOn(UrlService, 'generateShortId')
        .mockReturnValue(generatedId);

      (UrlStore.getShortUrl as jest.Mock).mockResolvedValue(undefined);

      const res = await UrlService.generateUniqueShortUrl();

      expect(res).toBe(generatedId);

      spy.mockRestore();
    });

    test('it should retry if the generated url already exists', async () => {
      const generatedId = nanoid();

      const spy = jest
        .spyOn(UrlService, 'generateShortId')
        .mockReturnValue(generatedId);

      const mockDbShortUrl = {
        short_url: generatedId,
      };

      (UrlStore.getShortUrl as jest.Mock)
        .mockResolvedValueOnce(mockDbShortUrl)
        .mockResolvedValueOnce(mockDbShortUrl)
        .mockResolvedValueOnce(undefined);

      const res = await UrlService.generateUniqueShortUrl();

      expect(spy).toHaveBeenCalledTimes(3);
      expect(res).toBe(generatedId);

      spy.mockRestore();
    });

    test('it should reject if the maximum number of retries has been reached', async () => {
      const generatedId = nanoid();

      const spy = jest
        .spyOn(UrlService, 'generateShortId')
        .mockReturnValue(generatedId);

      (UrlStore.getShortUrl as jest.Mock).mockResolvedValue({
        short_url: generatedId,
      });

      try {
        const res = await UrlService.generateUniqueShortUrl();
      } catch (error) {
        expect(error as string).toBe(
          'Exceeded maximum retries, please report this issue.',
        );

        expect(spy).toHaveBeenCalledTimes(5);
      }

      spy.mockRestore();
    });
  });
});
