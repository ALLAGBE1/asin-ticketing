import pool from './pool';

pool.on('connect', () => {
    console.log('connected to the db'); 
});

/**
 * Create Driver Table
 */
 const createDriverTable = () => {
     const enseignantCreateQuery = `CREATE TABLE IF NOT EXISTS driver`;

    pool.query(enseignantCreateQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
 };

 /************************************************************************************************************************ */

 /**
  * Create All Tables
  */

  const createAllTables = () => {
      createDriverTable();
  };


/************************************************************************************************** */
   pool.on('remove', () => {
       console.log('client removed');
       process.exit(0);
   });

   export {
       createAllTables,
   }
require('make-runnable');