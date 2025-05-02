const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI and Client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.utzib.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect(); // Connect once, keep alive

    const eventCollection = client.db('EventDB').collection('event');
    const userCollection = client.db('EventDB').collection('users');
    const teamsCollection = client.db('EventDB').collection('teams'); // 👈 same DB as event
 // 👈 New User Collection

    // === EVENT ROUTES ===
    app.post('/event', async (req, res) => {
      const newevent = req.body;
      console.log("Received event:", newevent);
      const result = await eventCollection.insertOne(newevent);
      res.send(result);
    });

    app.get('/event', async (req, res) => {
      const cursor = eventCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // === USER ROUTES ===
    // Register a new user
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
      // if (!name || !email || !password) {
      //   return res.status(400).send({ error: 'All fields are required.' });
      // }

      // const existingUser = await userCollection.findOne({ email });
      // if (existingUser) {
      //   return res.status(409).send({ error: 'User already exists.' });
      // }

      // const result = await userCollection.insertOne({ name, email, password });
      // res.send(result);
    });

    // Get all users (for testing)
    // Get a single user by Firebase UID
      app.get('/users/uid/:uid', async (req, res) => {
        const uid = req.params.uid;
        try {
          const user = await userCollection.findOne({ uid });
          if (user) {
            res.send(user);
          } else {
            res.status(404).send({ message: "User not found" });
          }
        } catch (error) {
          res.status(500).send({ message: "Server error", error });
        }
      });
    

    //==Team Routes == 
    //Create a team
  

    // Optional: Ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB");

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);

// Health check
app.get('/', (req, res) => {
  res.send("Volunteer Server is running");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
