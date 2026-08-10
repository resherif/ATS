const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const pool = new Pool({
   connectionString : process.env.DB_URL,  
   ssl: {
    rejectUnauthorized: false // ⚠️ ضروري جداً لاتصال Neon السحابي
  }

});
module.exports = pool;