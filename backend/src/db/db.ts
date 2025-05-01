
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',          // ✅ for local; replace with RDS endpoint when deploying
  user: 'root',               // ❗ change in prod
  password: 'root',              // ❗ set env variable in prod
  database: 'anomaly_system',
  waitForConnections: true,
  connectionLimit: 10,
});
export default db;