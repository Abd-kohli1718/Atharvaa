const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  // Inserts seed entries
  return knex('users').insert([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@bhashaconnect.com',
      password: hashedPassword,
      role: 'admin'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password: hashedPassword,
      role: 'jobseeker'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: hashedPassword,
      role: 'entrepreneur'
    },
    {
      id: 4,
      name: 'Amit Patel',
      email: 'amit@example.com',
      password: hashedPassword,
      role: 'jobseeker'
    },
    {
      id: 5,
      name: 'Sunita Devi',
      email: 'sunita@example.com',
      password: hashedPassword,
      role: 'entrepreneur'
    }
  ]);
};
