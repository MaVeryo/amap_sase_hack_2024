import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config';
import cookie from 'cookie-session';
import { MongoClient, ObjectId, Collection } from 'mongodb';
import { User } from "../types/user.js";
import { Job } from "../types/job.js";
import { getJobInfoFromLink } from "./utils.js";

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
app.get("/logout", ( req: express.Request, res: express.Response ) => {
    if (req.session) {
        req.session.login = false;
        req.session.userId = null;
    }
    res.status(200).send("Logged out");
});

app.get("/user-data", async ( req: express.Request, res: express.Response ) => {
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
app.post("/login", async ( req: express.Request, res: express.Response ) => {
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

app.post("/register", async ( req: express.Request, res: express.Response ) => {
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

app.post("/add-job", async ( req: express.Request, res: express.Response ) => {
    // Check if the user is logged in
    if (req.session && req.session.login && req.session.userId) {
        const user = await users.findOne({_id: new ObjectId(req.session.userId)});
        if (user) {
            // get the job information from the link
            const job: Job | null = await getJobInfoFromLink(req.body.link);
            if (!job) {
                res.status(400).send("Failed to get job information");
                return;
            }

            // add the job to the user's list of jobs and return the job to the client
            user.jobs.push(job);
            await users.updateOne({_id: new ObjectId(req.session.userId)}, {$set: {jobs: user.jobs}});
            res.status(200).json(job);
        } else {
            res.status(400).send("User not found");
        }
    }
});

app.post("/update-job-status", async ( req: express.Request, res: express.Response ) => {
    if (req.session && req.session.login && req.session.userId) {
        const user = await users.findOne({_id: new ObjectId(req.session.userId)});
        if (user) {
            user.jobs = user.jobs.map(( job: Job ) => job._id.toString() === req.body.id ? {
                ...job,
                status: req.body.status
            } : job);
            await users.updateOne({_id: new ObjectId(req.session.userId)}, {$set: {jobs: user.jobs}});
            res.status(200).send("Job updated");
        } else {
            res.status(400).send("User not found");
        }
    }
});

app.post("/delete-job", async ( req: express.Request, res: express.Response ) => {
    if (req.session && req.session.login && req.session.userId) {
        const user = await users.findOne({_id: new ObjectId(req.session.userId)});
        console.log("DELETE", user);
        if (user) {
            user.jobs = user.jobs.filter(( job: Job ) => job._id.toString() !== req.body.id);
            await users.updateOne({_id: new ObjectId(req.session.userId)}, {$set: {jobs: user.jobs}});
            res.status(200).send("Job deleted");
        } else {
            res.status(400).send("User not found");
        }
    }
});


ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
);
