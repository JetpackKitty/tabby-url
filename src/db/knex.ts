import config from '../../knexfile';
import dotenv from 'dotenv';
import knex from 'knex';
dotenv.config();

const environment = process.env.GK_ENVIRONMENT || 'development';
// @ts-ignore
export const knexConfig = config[environment];

export default knex(knexConfig);
