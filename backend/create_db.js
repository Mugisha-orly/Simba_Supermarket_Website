const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: '123123',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'simba_supermarket'");
    if (res.rows.length === 0) {
      await client.query("CREATE DATABASE simba_supermarket");
      console.log('Database simba_supermarket created');
    } else {
      console.log('Database simba_supermarket already exists');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
})();
