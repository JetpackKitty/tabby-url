import knex from '@db/knex';
import _ from 'lodash';
import { camelizeKeys as camelize } from 'humps';

const TableNames = {
  SHORT_URLS: 'short_urls',
};

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

export default {
  getShortUrl,
  createShortUrl,
};
