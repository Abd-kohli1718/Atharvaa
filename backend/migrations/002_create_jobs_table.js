exports.up = function(knex) {
  return knex.schema.createTable('jobs', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.string('category', 100).notNullable();
    table.string('location', 255).notNullable();
    table.string('language', 50).notNullable();
    table.integer('created_by').unsigned().notNullable();
    table.timestamps(true, true);
    
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE');
    table.index(['category']);
    table.index(['location']);
    table.index(['language']);
    table.index(['created_by']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('jobs');
};
