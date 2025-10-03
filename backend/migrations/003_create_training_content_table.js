exports.up = function(knex) {
  return knex.schema.createTable('training_content', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.enum('type', ['video', 'pdf', 'text', 'infographic']).notNullable();
    table.text('url').notNullable();
    table.string('language', 50).notNullable();
    table.text('description').nullable();
    table.integer('created_by').unsigned().notNullable();
    table.timestamps(true, true);
    
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE');
    table.index(['type']);
    table.index(['language']);
    table.index(['created_by']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('training_content');
};
