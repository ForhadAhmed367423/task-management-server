const express = require('express');
const app = express();
require('dotenv').config()
const jwt = require('jsonwebtoken');
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dnqomnb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // await client.connect();

    const tasksCollection = client.db("task-zone").collection("tasks");


    app.get('/tasks', async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });

    app.post("/tasks", async (req, res) => {
      const tasks = req.body;
      const result = await tasksCollection.insertOne(tasks);
      res.send(result);
      console.log(tasks, result);
    });
    app.get('/tasklist', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });

    app.put('/tasklist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateProp = req.body;
      const updateDoc = {
        $set: {

          task: updateProp.task

        },
        // image, title, agent_name, agent_image, location, user_email, Max_price, Min_Price, category
      };
      const result = await tasksCollection.updateOne(query, updateDoc, options)
      res.send(result)
    });

    app.delete('/tasklist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/managetask', async (req, res) => {
      const email = req.query.email;
      const todoFind = { email: email, status:'todo' };
      const completedFind = { email: email, status:'completed' };
      const ongoingFind = { email: email, status:'ongoing' };
      const todo = await tasksCollection.find(todoFind).toArray();
      const completed = await tasksCollection.find(completedFind).toArray();
      const  ongoing= await tasksCollection.find(ongoingFind).toArray();
      res.send({todo,completed,ongoing});
    })

    app.put('/ongoing/:id', async (req, res) => {
      console.log('forhad ahmed')
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {

          status: 'ongoing'

        },
        // image, title, agent_name, agent_image, location, user_email, Max_price, Min_Price, category
      };
      const result = await tasksCollection.updateOne(query, updateDoc, options)
      res.send(result);
    });
// completed
app.put('/ongoing/:id', async (req, res) => {
  console.log('forhad ahmed')
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const options = { upsert: true };
  const updateDoc = {
    $set: {

      status: 'ongoing'

    },
    // image, title, agent_name, agent_image, location, user_email, Max_price, Min_Price, category
  };
  const result = await tasksCollection.updateOne(query, updateDoc, options)
  res.send(result);
});g

  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('The task zone is running')
})

app.listen(port, () => {
  console.log(`The task zone running port is: ${port}`)
})