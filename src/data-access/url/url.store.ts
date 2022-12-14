import knex from '@db/knex';
import _ from 'lodash';
import { camelizeKeys as camelize } from 'humps';

const TableNames = {
  SHORT_URLS: 'short_urls',
};

const getShortUrl = async (shortUrl: string) => {
  try {
    const res = await knex
      .from(TableNames.SHORT_URLS)
      .where('short_url', shortUrl)
      .select()
      .first();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createShortUrl = async (input: { longUrl: string; shortUrl: string }) => {
  try {
    const { longUrl, shortUrl } = input;

    const insertRes = await knex(TableNames.SHORT_URLS).insert({
      short_url: shortUrl,
      long_url: longUrl,
      created_at: knex.fn.now(),
    });

    const res = await knex
      .from(TableNames.SHORT_URLS)
      .where('short_url', _.head(insertRes))
      .select();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  getShortUrl,
  createShortUrl,
};
