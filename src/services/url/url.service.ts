import { customAlphabet } from 'nanoid';
import { UrlStore } from '@data-access';

// Ideally configurations like these would be colocated in a separate place
// but this is not necessary for the small scope of this effort
const GEN_RETRY_LIMIT = 5;

// Although this appears to be adding another redundant layer over the data access layer,
// this is where additional enhancements or logic would be located should the requirements be expanded.
// e.g. needing to call additional services for data or triggering analytics
const getShortUrl = async (id: string) => {
  try {
    const res = await UrlStore.getShortUrl(id);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

// id string generation is abstracted to allow for changing
// generation method without affecting other business logic
const generateIdString = () => {
  const nanoid = customAlphabet('1234567890abcdef', 7);
  const generatedId = nanoid();

  return generatedId;
};

const generateUniqueId = async (attempts: number = 1): Promise<string> => {
  try {
    const generatedId = exportFunctions.generateIdString();
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

    return generateUniqueId(attempts + 1);
  }
};

const createShortUrl = async (input: { longUrl: string }) => {
  try {
    const { longUrl } = input;

    const uniqueShortId = await exportFunctions.generateUniqueId();

    const createdResult = await UrlStore.createShortUrl({
      longUrl,
      id: uniqueShortId,
    });

    return createdResult;
  } catch (error) {
    return Promise.reject(error);
  }
};

// this manner of export is necessary to allow for mocking functions within the same module
const exportFunctions = {
  getShortUrl,
  generateIdString,
  generateUniqueId,
  createShortUrl,
};

export default exportFunctions;
