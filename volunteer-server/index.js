const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    await client.connect();

    const eventCollection = client.db('EventDB').collection('event');
    const userCollection = client.db('EventDB').collection('users');
    const teamsCollection = client.db('EventDB').collection('teams');
    const requestCollection = client.db('EventDB').collection('request');
    const messageCollection = client.db('EventDB').collection('messages');

    // === EVENT ROUTES ===
    app.post('/event', async (req, res) => {
      const newevent = req.body;
      const result = await eventCollection.insertOne(newevent);
      res.send(result);
    });

    app.get('/event', async (req, res) => {
      const cursor = eventCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // ✅ === JOIN EVENT ROUTE ===
    app.post('/join-event', async (req, res) => {
      const { eventId, userEmail, userUid } = req.body;
    
      if (!eventId || !userEmail || !userUid) {
        return res.status(400).send({ error: "Missing eventId, userEmail, or userUid." });
      }
    
      try {
        // Add user to the event's joinedUsers array
        const eventUpdateResult = await eventCollection.updateOne(
          { _id: new ObjectId(eventId) },
          { $addToSet: { joinedUsers: userUid } }  // Add user UID to the event's joinedUsers array
        );
    
        if (eventUpdateResult.modifiedCount === 0) {
          return res.status(404).send({ error: "Event not found or user already joined." });
        }
    
        // Add the eventId to the user's event list
        const userUpdateResult = await userCollection.updateOne(
          { uid: userUid },
          { $addToSet: { events: eventId } }  // Add eventId to the user's events list
        );
    
        if (userUpdateResult.modifiedCount > 0) {
          res.send({ success: true, message: "Successfully joined event and updated user data." });
        } else {
          res.status(500).send({ error: "Failed to update user's events list." });
        }
      } catch (error) {
        console.error("Error joining event:", error);
        res.status(500).send({ error: "Failed to join event." });
      }
    });
    

    // === USER ROUTES ===
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/users/uid/:uid', async (req, res) => {
      const uid = req.params.uid;
      try {
        const user = await userCollection.findOne({ uid });
        if (user) res.send(user);
        else res.status(404).send({ message: "User not found" });
      } catch (error) {
        res.status(500).send({ message: "Server error", error });
      }
    });

    // === TEAM ROUTES ===
    app.post('/team', async (req, res) => {
      const newTeam = req.body;
      try {
        const result = await teamsCollection.insertOne(newTeam);
        if (result.insertedId) {
          const memberUids = newTeam.members.map(member => member.uid);
          const updateResult = await userCollection.updateMany(
            { uid: { $in: memberUids } },
            { $addToSet: { teams: newTeam.teamName } }
          );
          res.send({ insertedId: result.insertedId, updatedUsers: updateResult.modifiedCount });
        } else {
          res.status(500).send({ error: 'Failed to create team' });
        }
      } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
      }
    });

    app.get('/teams', async (req, res) => {
      const cursor = teamsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/team/leader/:uid', async (req, res) => {
      const leaderUid = req.params.uid;
      try {
        const team = await teamsCollection.findOne({ leaderUid });
        if (team) res.send(team);
        else res.status(404).send({ message: 'No team found for this leader' });
      } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
      }
    });

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
        res.status(500).send({ error: 'Internal server error' });
      }
    });

    // === REQUEST ROUTES ===
    app.post('/request', async (req, res) => {
      try {
        const newReq = req.body;
        if (!newReq.title || !newReq.description) {
          return res.status(400).send({ error: "Title and description are required." });
        }

        newReq.createdAt = new Date();
        const result = await requestCollection.insertOne(newReq);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to create request" });
      }
    });

    app.get('/request', async (req, res) => {
      try {
        const requests = await requestCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        res.send(requests);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch requests" });
      }
    });

    // === MESSAGE ROUTES ===
    app.post('/messages', async (req, res) => {
      const { messageText, userId, userName, postId } = req.body;

      if (!messageText || !userId || !userName || !postId) {
        return res.status(400).send({ error: 'All fields are required.' });
      }

      const newMessage = {
        messageText,
        userId,
        userName,
        postId,
        timestamp: new Date()
      };

      try {
        const result = await messageCollection.insertOne(newMessage);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
      }
    });

    app.get('/messages/:postId', async (req, res) => {
      const { postId } = req.params;

      try {
        const messages = await messageCollection.find({ postId }).toArray();

        const sanitizedMessages = messages.map(msg => ({
          ...msg,
          _id: msg._id.toString(),
          timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
        }));

        res.json(sanitizedMessages);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
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
