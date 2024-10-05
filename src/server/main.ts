import express from "express";
import ViteExpress from "vite-express";

import 'dotenv/config';
import cookie from 'cookie-session';
import { MongoClient, ObjectId, Collection } from 'mongodb';
import { User } from "../types/user.js";

const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(express.static('src'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));      // use express.urlencoded to get data sent by default form actions or GET requests
app.use(cookie({                                    // cookie middleware - the keys are used for encryption and should be changed for production
    name: 'session',
    keys: [ 'key1', 'key2' ]
}));


// ----------------- MONGODB -----------------
let users: Collection;
try {
    const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
    const client = new MongoClient(uri);

    await client.connect();
    users = client.db('AMAP').collection('users');
    console.log("Connected to database");
} catch {
    console.log("Error connecting to database");
}


// ----------------- ROUTES -----------------
// --- GET ---
app.get("/logout", (req, res) => {
    if (req.session) {
        req.session.login = false;
        req.session.userId = null;
    }
    res.status(200).send("Logged out");
});

app.get("/user-data", async (req: express.Request, res: express.Response) => {
    if (req.session && req.session.login && req.session.userId) {
        const user = await users.findOne({_id: new ObjectId(req.session.userId)});
        if (user) {
            console.log("GET user-data", user?._id);
            res.status(200).json(user);
        } else {
            res.status(400).send("User not found");
        }
    }
});

// --- POST ---
app.post("/login", async (req, res) => {
    let username = req.body.user;
    let password = req.body.pass;

    // Find the user with the matching username
    let user = await users.findOne({username: username, password: password});

    // If a user is found, check if the password matches
    if (user != null && user.username === username && user.password === password) {
        // @ts-ignore
        req.session.userId = user._id;
        // @ts-ignore
        req.session.login = true;

        res.status(200).json(user.docs);
    } else {
        console.log("not found")
        res.status(400).send("Either Login or Password are incorrect");
    }
});

app.post("/register", async (req, res) => {
    let username = req.body.user;
    let password = req.body.pass;

    // Check if the username is already taken
    let user = await users.findOne({username: username});
    if (user != null) {
        res.status(400).send("Username already taken");
    } else {
        // Add the user to the database
        const newUser: User = {username: username, password: password, jobs: []};
        await users.insertOne(newUser);
        res.status(200).send("User added");
    }
});



ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
