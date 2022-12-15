import knex from '@db/knex';
import _ from 'lodash';
import { camelizeKeys as camelize } from 'humps';

const TableNames = {
  SHORT_URLS: 'short_urls',
};

// Caching is not implemented in this example but if it were to be used
// to improve performance, then it would implemented in this layer.

const getShortUrl = async (id: string) => {
  try {
    const res = await knex
      .from(TableNames.SHORT_URLS)
      .where('id', id)
      .select()
      .first();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const listShortUrls = async (options?: { limit: number; offset: number }) => {
  try {
    const { limit = 50, offset = 0 } = options || {};

    const res = await knex
      .from(TableNames.SHORT_URLS)
      .limit(limit)
      .offset(offset)
      .select();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createShortUrl = async (input: { longUrl: string; id: string }) => {
  try {
    const { longUrl, id } = input;

    await knex(TableNames.SHORT_URLS).insert({
      id: id,
      long_url: longUrl,
      created_at: knex.fn.now(),
    });

    const res = await knex
      .from(TableNames.SHORT_URLS)
      .where('id', id)
      .select()
      .first();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteShortUrl = async (id: string) => {
  try {
    const res = await knex(TableNames.SHORT_URLS).where('id', id).del();

    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  getShortUrl,
  listShortUrls,
  createShortUrl,
  deleteShortUrl,
};
