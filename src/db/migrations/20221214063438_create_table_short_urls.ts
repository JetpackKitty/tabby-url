import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
		CREATE TABLE short_urls (
			short_url VARCHAR(7) NOT NULL,
			created_at DATETIME NOT NULL DEFAULT NOW(),
			long_url VARCHAR(255) NOT NULL,
			PRIMARY KEY (short_url)
		);
	`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
		DROP TABLE short_urls;
	`);
}
