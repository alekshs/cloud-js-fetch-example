const tiledb = require('@tiledb-inc/tiledb-cloud');

/**
 * API tokens are the recommend way to access the cloud apis
 */
const config = {
  apiKey: '<your-api-key>',
}

/**
 * Username and passwords are also supported, uncomment below and comment out above to use username/password auth instead
 */
// const config = {
//   username: '<username>',
//   password: '<password>'
// }

const namespace = "<namespace>"

// First we must create API objects.
// In the future we will improve and simplify this interface
const sqlAPI = new tiledb.SqlApi(config);

// SQL query
const sql = "select `rows`, AVG(a) as avg_a from `tiledb://TileDB-Inc/quickstart_dense` GROUP BY `rows`";

const sqlDetails = {
  query: sql
};

/**
 * Cloudflare worker handler for sql query
 */
async function sqlQueryHandler(request) {
  try {
    // Run SQL and print any returned data
    const res = await sqlAPI.runSQL(namespace, sqlDetails);
    return new Response(JSON.stringify(res))
  } catch (err) {
    return new Response(err.stack || err)
  }
}

/** 
 * Cloudflare event listener
 */
addEventListener('fetch', event => {
  event.respondWith(sqlQueryHandler(event.request))
});
