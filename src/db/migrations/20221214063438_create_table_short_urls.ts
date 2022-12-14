import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
		CREATE TABLE short_urls (
			id VARCHAR(7) NOT NULL,
			created_at DATETIME NOT NULL DEFAULT NOW(),
			long_url VARCHAR(255) NOT NULL,
			PRIMARY KEY (id)
		);
	`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
		DROP TABLE short_urls;
	`);
}
