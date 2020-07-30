require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const { Pool } = require("pg");
const { doPost, asyncWrap } = require("./utils/index");

const port = process.env.PORT;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  // eslint-disable-next-line radix
  port: parseInt(process.env.DB_PORT),
});

/**
 * Returns the latest 50 blocks
 * @return data {Array} Array containing up to the last fifty blocks.
 */
app.get(
  "/blocks",
  asyncWrap(async (req, res) => {
    const query = "select * from blocks order by blockNumber desc limit 50";
    const response = await pool.query(query);
    res.send({ data: response.rows });
  })
);

/**
 * Error middleware to catch any failed calls to async endpoints.
 */
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.json({ message: error.message });
});

/**
 * Queries infura for the lastest block
 * @return {JSON} block object containing metadata regarding the block.
 */
async function queryInfura() {
  const url = `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`;
  const body = {
    jsonrpc: "2.0",
    method: "eth_getBlockByNumber",
    params: ["latest", false],
    id: process.env.INFURA_ID,
  };

  const { result } = await doPost(url, body);
  return result;
}

/**
 * Queries infura for the newest block and stores if it does not exist in the database.
 * @return {boolean} true if there is no error updating the db
 */
async function storeBlock() {
  try {
    const {
      number,
      size,
      timestamp,
      nonce,
      gasLimit,
      hash,
    } = await queryInfura();
    // eslint-disable-next-line radix
    const blockInteger = parseInt(number);

    const checkQuery = "select * from blocks where blocknumber = $1";
    const checkResponse = await pool.query(checkQuery, [blockInteger]);

    if (checkResponse.rows.length === 0) {
      const query =
        "insert into blocks(blocknumber, size,timestamp,nonce,gaslimit,hash) values ($1,$2,$3,$4,$5,$6)";
      pool.query(query, [blockInteger, size, timestamp, nonce, gasLimit, hash]);
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Updates the DB with the most recent block every 10 seconds.
 */
setInterval(storeBlock, 10000);

/**
 * Initializes the server.
 */
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = { app, queryInfura, storeBlock };
