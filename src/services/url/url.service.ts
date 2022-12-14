import { customAlphabet } from 'nanoid';
import { UrlStore } from '@data-access';

const GEN_RETRY_LIMIT = 5;

// id string generation is abstracted to allow for changing
// generation method without affecting other business logic
const generateShortId = () => {
  const nanoid = customAlphabet('1234567890abcdef', 10);
  const generatedId = nanoid();

  return generatedId;
};

const generateUniqueShortUrl = async (
  attempts: number = 1,
): Promise<string> => {
  try {
    const generatedId = exportFunctions.generateShortId();
    const existingShortUrl = await UrlStore.getShortUrl(generatedId);

    if (existingShortUrl) {
      throw new Error('exists');
    }

    return generatedId;
  } catch (error) {
    const maxAttempts = GEN_RETRY_LIMIT;

    if (attempts >= maxAttempts) {
      return Promise.reject(
        'Exceeded maximum retries, please report this issue.',
      );
    }

    return generateUniqueShortUrl(attempts + 1);
  }
};

// this manner of export is necessary to allow for mocking functions within the same module
const exportFunctions = {
  generateShortId,
  generateUniqueShortUrl,
};

export default exportFunctions;
