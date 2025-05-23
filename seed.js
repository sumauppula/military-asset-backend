const db = require('./models/db');

async function seed() {
  try {
    // Insert roles
    await db.query(`
      INSERT INTO roles (id, role_name) VALUES
      (1, 'admin'),
      (2, 'commander'),
      (3, 'officer'),
      (4, 'soldier')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert bases
    await db.query(`
      INSERT INTO bases (id, base_name, location) VALUES
      (1, 'Base Alpha', 'Hyderabad'),
      (2, 'Base Bravo', 'Delhi')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert asset types
    await db.query(`
      INSERT INTO asset_types (id, name, description) VALUES
      (1, 'Tank', 'Armored combat vehicle'),
      (2, 'Rifle', 'Standard infantry weapon'),
      (3, 'Jeep', 'Light transport vehicle')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert sample user (password_hash should be hashed in real apps)
    await db.query(`
      INSERT INTO users (id, username, password_hash, role_id, base_id) VALUES
      (1, 'admin_user', 'hashed_password_here', 1, 1)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

seed();

