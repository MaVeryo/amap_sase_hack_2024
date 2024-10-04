import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config';
import cookie from 'cookie-session';
import { MongoClient, ObjectId, Collection } from 'mongodb';

const app = express();

// middleware
app.use(express.static('src'))
app.use(express.json())

let users: Collection;
async function run() {
  const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
  const client = new MongoClient(uri);

  await client.connect();
  users = client.db('AMAP').collection('users');
}

try {
    run().catch(console.dir);
    console.log("Connected to database");
} catch {
    console.log("Error connecting to database");
}

// ----------------- ROUTES -----------------
// --- GET ---
app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

// --- POST ---

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
