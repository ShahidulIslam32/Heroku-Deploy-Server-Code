const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId;

//middleware   

app.use(cors())
app.use(express.json())

//connect with database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyodn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// async function

async function run(){
    try{
        await client.connect()
        const userCollection = client.db("foodExpress").collection("user")

        // send / create a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body
            console.log(newUser)
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })

        //get user data from DB
        app.get('/user', async (req , res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        // delete a user
        app.delete('/user/:id' , async (req , res) => {
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        //update a user
        app.get('/user/:id' , async (req , res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id)}
            const result = await userCollection.findOne(query)
            res.send(result)
        })
    }
    finally{

    }
}

run().catch(console.dir)



app.get('/', (req, res) => 
res.send('Hello World! My new Mongo Server !! its working'))


app.listen(port, () => 
console.log(`Example app listening on port ${port}!`))