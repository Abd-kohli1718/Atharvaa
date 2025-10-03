exports.up = function(knex) {
  return knex.schema.createTable('schemes', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.text('eligibility').notNullable();
    table.text('link').nullable();
    table.string('language', 50).notNullable();
    table.string('category', 100).nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.index(['language']);
    table.index(['category']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('schemes');
};
