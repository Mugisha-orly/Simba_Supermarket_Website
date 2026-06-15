/**
 * Standalone migration script.
 * Run: npm run migrate
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { initDb, getPool } = require('./db');

(async () => {
  try {
    await initDb();
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await getPool().end();
  }
})();
