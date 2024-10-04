import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config';
import cookie from 'cookie-session';
import { MongoClient, ObjectId, Collection } from 'mongodb';

const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(express.static('src'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));      // use express.urlencoded to get data sent by default form actions or GET requests
app.use(cookie({                                    // cookie middleware - the keys are used for encryption and should be changed for production
    name: 'session',
    keys: [ 'key1', 'key2' ]
}));

// middleware that always sends unauthenticated users to the login page
// app.use( function( req,res,next) {
//   if( req.session.login === true )
//     next();
// else
// res.sendFile( __dirname + '/public/main.html' )
// });

// ----------------- MONGODB -----------------
let users: Collection;
try {
    const uri = `mongodb+srv://${process.env.APP_USER}:${process.env.PASS}@${process.env.HOST}`;
    const client = new MongoClient(uri);


    await client.connect();
    users = client.db('AMAP').collection('users');
    console.log("Connected to database");
} catch {
    console.log("Error connecting to database");
}

// ----------------- ROUTES -----------------
// --- GET ---

// --- POST ---
app.post("/login", async (req, res) => {
    // express.urlencoded will put your key value pairs
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    let username = req.body.user
    let password = req.body.pass

    // Find the user with the matching username
    let user = await users.findOne({username: username, password: password})

    // If a user is found, check if the password matches
    if (user != null && user.username === username && user.password === password) {
        // @ts-ignore
        req.session.user = user.username
        // @ts-ignore
        req.session.login = true

        res.status(200).send("Login and Password correct")
    } else {
        console.log("not found")
        res.status(400).send("Either Login or Password are incorrect")
    }
});

app.post("/register", async (req, res) => {
    console.log(req.body)
    let username = req.body.user
    let password = req.body.pass

    // Check if the username is already taken
    let user = await users.findOne({user: username})
    if (user != null) {
        res.status(400).send("Username already taken")
    } else {
        // Add the user to the database
        await users.insertOne({user: username, pass: password})
        res.status(200).send("User added")
    }
});


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
