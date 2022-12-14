import knex from '@db/knex';
import _ from 'lodash';
import { camelize } from 'humps';

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

export default {
  getShortUrl,
};
