exports.up = function(knex) {
  return knex.schema.createTable('marketplace', function(table) {
    table.increments('id').primary();
    table.string('business_name', 255).notNullable();
    table.string('owner_name', 255).notNullable();
    table.text('product_service').notNullable();
    table.string('contact', 255).notNullable();
    table.string('language', 50).notNullable();
    table.string('location', 255).nullable();
    table.text('description').nullable();
    table.integer('created_by').unsigned().notNullable();
    table.timestamps(true, true);
    
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE');
    table.index(['language']);
    table.index(['location']);
    table.index(['created_by']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('marketplace');
};
