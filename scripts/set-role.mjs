// Usage: node scripts/set-role.mjs <email> <user|coach|admin>
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import mongoose from 'mongoose';

// Tiny .env reader — avoids depending on the `dotenv` package
for (const file of ['.env.local', '.env']) {
  try {
    const text = readFileSync(resolve(process.cwd(), file), 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const [, k, raw] = m;
      if (process.env[k]) continue;
      process.env[k] = raw.replace(/^['"]|['"]$/g, '');
    }
  } catch {
    // file missing — fine
  }
}

const [, , email, role] = process.argv;
if (!email || !['user', 'coach', 'admin'].includes(role)) {
  console.error('Usage: node scripts/set-role.mjs <email> <user|coach|admin>');
  process.exit(1);
}

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-ai-coach';
await mongoose.connect(uri);

const result = await mongoose.connection
  .collection('users')
  .updateOne({ email: email.toLowerCase() }, { $set: { role } });

if (result.matchedCount === 0) {
  console.error(`No user with email ${email}`);
  process.exit(1);
}

console.log(`Set ${email} -> role=${role}`);
await mongoose.disconnect();
