
exports.up = async (knex, Promise) => {
  await knex.schema.createTable('users', (table) => {
    table.string('email').notNullable();
    table.string('name').notNullable();
    table.string('profilePicture').notNullable();
    table.string('googleUserId').notNullable();
    table.string('center').notNullable();
    table.string('githubLink').notNullable();
    table.string('linkedinLink').notNullable();
    table.string('mediumLink').notNullable();
    table.datetime('createdAt').notNullable();
  });
};

exports.down = async (knex, Promise) => {
  const dropTable = await knex.schema.dropTable('users');
  return dropTable;
};
