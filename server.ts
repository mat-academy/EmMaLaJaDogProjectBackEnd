import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/votes", async (req, res) => {
  try {
    const topTen = await client.query('select breed_name, count(breed_name) from votes group by breed_name order by count(breed_name) desc limit 10');
    res.json(topTen.rows);
  } catch (error) {
    console.log(error);
  }
});

let insertVote = 'INSERT INTO votes (breed_name, user_name) VALUES ($1, $2)'

app.post("/", async (req, res) => {
  try {
    const {breed_name, user_name} = req.body
    console.log('req.body', req.body);
    console.log('breed/sub-breed', breed_name);
    console.log('user', user_name);
    const addNewVote = await client.query(
      insertVote, [breed_name, user_name]
    );
    res.json(addNewVote.rows)
  } catch (error) {
    console.error();
    res.sendStatus(500);
  }
});


//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
