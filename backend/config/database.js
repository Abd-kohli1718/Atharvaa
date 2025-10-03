// backend/config/database.js
const mysql = require('mysql2');
const knex = require('knex');
// Create a connection to MySQL
const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Tanmay@9972',
    database: 'bhashaconnect'
  }
});



// Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error('❌ Database connection failed:', err.message);
//     return;
//   }
//   console.log('✅ Connected to MySQL database');
// });

module.exports = db;
