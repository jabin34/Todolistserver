const express = require('express');
const cors = require('cors');
const app = express(); 
const port = process.env.PORT || 4000 ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
//middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.g0xjd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        console.log('mongo connectd');
        const collection = client.db("todo").collection("tasklist");
        app.get('/data',(req,res)=>{
         res.send({"message":"hello"})
        });
        app.post('/addtask',async(req,res)=>{
                    const task = req.body;
                    console.log(task);
                    const result = await collection.insertOne(task);
                    res.send(result);
                });

                app.get('/alltask',async(req,res)=>{
                    const task = await collection.find().toArray();
                    res.send(task);
                });
                app.put('/task/:id',async(req,res)=>{
                    const id = req.params.id;
                    console.log(id);
                    const data = req.body;
                    const filter = {_id:ObjectId(id)};
                    const option = {update:true};
                    const update = {
                        $set:{ flag:data.newflag},
                    };
                    const result = await collection.updateOne(filter,update,option);
                    console.log('data->',result);
                    res.send({result});
                 });

                 app.delete('/task/:id',async(req,res)=>{
                    const id  = req.params.id;
                    console.log(id);
                    const query = {_id:ObjectId(id)};
                    const result = await collection.deleteOne(query);
                    res.send(result);
                });

    }
    finally{}
}
run().catch(console.dir);


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('mongo connectd');
//   // perform actions on the collection object
//   client.close();
// });

// async function run(){
//     try{
//      await client.connect();
//      const taskcollection = client.db("todoapp").collection("tasklist");
//       console.log('connected to mongo');
// //     app.post('/addtask',async(req,res)=>{
// //         const task = req.body;
// //         const result = await taskcollection.insertOne(task);
// //         res.send(result);
// //     });
//  }finally{

//  }
//  }
//  run().catch(console.dir);

//  client.connect();
//   const taskcollection = client.db("todo").collection("tasklist");
//   console.log('connected to mongo');


// app.post('/addtask',async(req,res)=>{
//     const task = req.body;
//     console.log(task);
//     const result = await taskcollection.insertOne(task);
//     res.send(result);
// });



app.get('/',(req,res)=>{
    res.send("server is running");
});

//port listening

app.listen(port,()=>{
    console.log('listening to port',port);
});
