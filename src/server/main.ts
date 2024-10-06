import express from "express";
import ViteExpress from "vite-express";

import 'dotenv/config';
import cookie from 'cookie-session';
import { MongoClient, ObjectId, Collection } from 'mongodb';
import { User } from "../types/user.js";
<<<<<<< Updated upstream
=======
import { Job } from "../types/job.js";
import { getJobInfoFromLink } from "./utils.js";
import LlamaAI from 'llamaai';
>>>>>>> Stashed changes

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
    let uri = `mongodb+srv://aldencutler84:uyK8xf2yPgimds7L@cluster0.vdsb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    let email=req.body.email;
    let phone=req.body.phone;
    let resume=req.body.resume;
    let linkedin=req.body.linkedin;
    let portfolio=req.body.portfolio;

    // Check if the username is already taken
    let user = await users.findOne({username: username});
    if (user != null) {
        res.status(400).send("Username already taken");
    } else {
        // Add the user to the database
        const newUser: User = {username: username, password: password, jobs: [], email:email, phone:phone, resume:resume, experience:[],linkedin:linkedin,portfolio:portfolio};
        await users.insertOne(newUser);
        res.status(200).send("User added");
    }
});


// --- LLAMAAI ---
const apiToken = process.env.LLAMA_API;
const llamaAPI = new LlamaAI(apiToken);
// Test llama to see if we actually have it lmao
app.get('/test-llama', async ( _, res) => {
    console.log(apiToken)
    try {
        const apiRequestJson = {
            messages: [{ role: "user", content: "I want a cake recipe" }],
        };
        const response = await llamaAPI.run(apiRequestJson);
        console.log("hello!");

        if (response.choices[0].message.function_call) {
            const functionCall = response.choices[0].message.function_call;
            console.log(`Function to call: ${functionCall}`);
        }

        res.json(response);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
  });


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
