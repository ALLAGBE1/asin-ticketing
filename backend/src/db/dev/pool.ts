const { Pool } = require('pg');


const pool = new Pool({
    user:'duamelo',
    host: 'localhost',
    database: 'ticketindb',
    password: '@epi25',
    port: 5432,
});

export default pool;





