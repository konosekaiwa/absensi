// app/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'black',      // Ganti dengan username database kamu
  host: 'localhost',          // Ganti jika database kamu di server lain
  database: 'absensi_magang',   // Ganti dengan nama database kamu
  password: 'darkmode', // Ganti dengan password database kamu
  port: 5432,                 // Port default PostgreSQL
});

export default pool;
