/**
 * Simple synchronous JSON file store.
 * Each collection is a separate JSON file in database/data/.
 * No native modules required — works on any Node.js platform.
 */
const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function read(name) {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  } catch {
    return [];
  }
}

function write(name, records) {
  fs.writeFileSync(filePath(name), JSON.stringify(records, null, 2));
}

// ── Collection factory ────────────────────────────────────────────────────────
class Collection {
  constructor(name) {
    this.name = name;
  }

  all() {
    return read(this.name);
  }

  findById(id) {
    return this.all().find(r => String(r.id) === String(id)) || null;
  }

  findOne(predicate) {
    return this.all().find(predicate) || null;
  }

  where(predicate) {
    return this.all().filter(predicate);
  }

  count() {
    return this.all().length;
  }

  insert(record) {
    const records = this.all();
    records.push(record);
    write(this.name, records);
    return record;
  }

  updateById(id, updates) {
    const records = this.all();
    const idx = records.findIndex(r => String(r.id) === String(id));
    if (idx === -1) return null;
    records[idx] = { ...records[idx], ...updates };
    write(this.name, records);
    return records[idx];
  }

  removeById(id) {
    const records = this.all();
    const filtered = records.filter(r => String(r.id) !== String(id));
    write(this.name, filtered);
  }
}

// ── Singleton collections ─────────────────────────────────────────────────────
const collections = {
  users:    new Collection('users'),
  products: new Collection('products'),
  orders:   new Collection('orders'),
};

function initDb() {
  ensureDataDir();
  console.log('JSON file store ready at', DATA_DIR);
}

module.exports = { initDb, ...collections };
