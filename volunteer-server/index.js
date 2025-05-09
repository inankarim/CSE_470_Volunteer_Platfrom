const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
///////////////////////////////////////////////
app.use('/uploads', express.static('uploads'));  // Serve the uploaded images


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
        const eventUpdateResult = await eventCollection.updateOne(
          { _id: new ObjectId(eventId) },
          { $addToSet: { joinedUsers: userUid } }
        );

        if (eventUpdateResult.modifiedCount === 0) {
          return res.status(404).send({ error: "Event not found or user already joined." });
        }

        const userUpdateResult = await userCollection.updateOne(
          { uid: userUid },
          { $addToSet: { events: eventId } }
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

    // === GET EVENT BY ID ===
    app.get('/event/:id', async (req, res) => {
      const eventId = req.params.id;

      try {
        const event = await eventCollection.findOne({ 
          _id: new ObjectId(eventId) 
        });

        if (!event) {
          return res.status(404).send({ message: "Event not found" });
        }

        if (req.query.userUid) {
          const user = await userCollection.findOne({ uid: req.query.userUid });
          event.isAttending = user?.events?.includes(eventId) || false;
        }

        res.send(event);
      } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).send({ error: "Failed to fetch event" });
      }
    });

    // ✅ === GET JOINED EVENTS BY UID ===
    app.get('/joined-events/:uid', async (req, res) => {
      const uid = req.params.uid;

      try {
        const user = await userCollection.findOne({ uid });

        if (!user || !user.events || user.events.length === 0) {
          return res.send([]);
        }

        const objectIds = user.events.map(id => new ObjectId(id));
        const joinedEvents = await eventCollection.find({ _id: { $in: objectIds } }).toArray();

        res.send(joinedEvents);
      } catch (error) {
        console.error('Error fetching joined events:', error);
        res.status(500).send({ error: 'Failed to fetch joined events.' });
      }
    });
    app.post('/event/user-events', async (req, res) => {
      const { eventIds } = req.body;
    
      if (!eventIds || !Array.isArray(eventIds)) {
        return res.status(400).send({ error: 'eventIds must be an array' });
      }
    
      try {
        const objectIds = eventIds.map(id => new ObjectId(id));
        const result = await eventCollection.find({ _id: { $in: objectIds } }).toArray();
        res.send(result);
      } catch (err) {
        console.error('Error fetching user events:', err);
        res.status(500).send({ error: 'Internal Server Error' });
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
////////////////////////////////////////////////////
// USER Update part!
app.get('/users/:uid', async (req, res) => {
  const uid = req.params.uid;
  const user = await userCollection.findOne({ uid });

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  res.json({ success: true, data: user });
});

// Update username and skills///////////////
app.put('/users/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    // Collect updates from the request body
    const updates = {
      ...(req.body.uname && { uname: req.body.uname }),  // Update uname if provided
      ...(req.body.skills && { skills: req.body.skills }),  // Update skills if provided
      ...(req.body.imageUrl && { imageUrl: req.body.imageUrl })  // Update imageUrl if provided
    };

    // If no valid fields to update, return an error
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid fields provided for update"
      });
    }

    // Perform the update in MongoDB
    const result = await userCollection.updateOne(
      { uid },  // Find user by uid
      { $set: updates }  // Set the updated fields
    );

    // Check if user was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Return the success response
    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});


// Setup multer for file storage
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Define the folder for uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);  // Get file extension
    cb(null, `${Date.now()}${ext}`);  // Give a unique name to the file
  }
});

const upload = multer({ storage: storage });  // Initialize multer with storage options

// Handle image upload and update user's image URL
app.post('/users/upload-image/:uid', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;  // URL for the image

  try {
    const result = await userCollection.updateOne(
      { uid: req.params.uid },
      { $set: { imageUrl } }  // Update the user's image URL in the database
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, imageUrl });  // Return the updated image URL
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

/////////////////////////////////////////////////


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
    //...............................................................
    // Add user to a team (join team)
app.post('/api/join-team', async (req, res) => {
  const { userId, teamId, uname } = req.body;  // userId and teamId from request body
  
  try {
    // Find the team by teamId
    const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if the user is already a member of the team
    if (team.members.some(member => member.uid === userId)) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    // Add the user to the team's members array
    await teamsCollection.updateOne(
      { _id: new ObjectId(teamId) },
      { $push: { members: { uid: userId, uname: uname } } }  // Push the user's UID and username to the team members array
    );

    // Add the teamId to the user's teams array
    await userCollection.updateOne(
      { uid: userId },
      { $addToSet: { teams: teamId } }  // Add the teamId to the user's teams array (no duplicates)
    );

    res.status(200).json({ message: 'User joined the team successfully' });
  } catch (err) {
    console.error('Error joining team:', err);
    res.status(500).json({ message: 'Internal server error' });
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