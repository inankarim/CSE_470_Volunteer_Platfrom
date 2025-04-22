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

    // POST route for adding event
    app.post('/event', async (req, res) => {
      const newevent = req.body;
      console.log("Received event:", newevent);
      const result = await eventCollection.insertOne(newevent);
      res.send(result);
    });
    //getting the cards
    app.get('/event',async(req, res) =>{
        const cursor = eventCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    // Optional: Ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB");

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
  // ❌ DO NOT close the client here
  // await client.close();
}

run().catch(console.dir);

// Health check
app.get('/', (req, res) => {
  res.send("Volunteer Server is running");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
