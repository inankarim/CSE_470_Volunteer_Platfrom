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
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
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
    app.post('/team', async (req, res) => {
      const newTeam = req.body;
      console.log("Received event:", newTeam);
      try {
        // Insert the new team
        const result = await teamsCollection.insertOne(newTeam);
    
        if (result.insertedId) {
          // Get all member UIDs
          const memberUids = newTeam.members.map(member => member.uid);
    
          // Update each user: add the team name to their profile
          const updateResult = await userCollection.updateMany(
            { uid: { $in: memberUids } },
            { $addToSet: { teams: newTeam.teamName } }  // creates "teams" array if missing
          );
    
          console.log(`Updated ${updateResult.modifiedCount} user(s) with the team name.`);
    
          res.send({ insertedId: result.insertedId, updatedUsers: updateResult.modifiedCount });
        } else {
          res.status(500).send({ error: 'Failed to create team' });
        }
      } catch (err) {
        console.error('Error creating team:', err);
        res.status(500).send({ error: 'Internal server error' });
      }
    });
    app.get('/teams', async (req, res) => {
      const cursor = teamsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    const { ObjectId } = require('mongodb'); // Make sure this is at the top if not already

    // Get a team by leader UID
    app.get('/team/leader/:uid', async (req, res) => {
      const leaderUid = req.params.uid;
      console.log(leaderUid)

      try {
        const team = await teamsCollection.findOne({ leaderUid });
        if (team) {
          res.send(team);
        } else {
          res.status(404).send({ message: 'No team found for this leader' });
        }
      } catch (err) {
        console.error("Failed to fetch team by leader:", err);
        res.status(500).send({ error: 'Internal server error' });
      }
    });
    //Update team
    // Update a team by leaderUid
    app.put('/team/leader/:uid', async (req, res) => {
    const leaderUid = req.params.uid;
    const { teamName, imageUrl, members } = req.body;

    try {
      const updateFields = {};
      if (teamName) updateFields.teamName = teamName;
      if (imageUrl) updateFields.imageUrl = imageUrl;
      if (Array.isArray(members)) updateFields.members = members;

      const result = await teamsCollection.updateOne(
        { leaderUid },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        res.status(404).send({ message: 'Team not found' });
      } else {
        res.send(result);
      }
    } catch (err) {
      console.error("Failed to update team:", err);
      res.status(500).send({ error: 'Internal server error' });
    }
  });




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
