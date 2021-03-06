'use strict';

const PORT = process.env.PORT || 8080;
const dbUrl = "mongodb://localhost:27017/";
const dbName = "educationDB";

const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const mongoClient = new MongoClient(dbUrl);

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get("/", (request, response) => {
  response.end("It's default route");
});

app.get("/evaluate", (request, response) => {
  console.log('Education evaluate data')
  mongoClient.connect((error, client) => {
    try {
     if (!error) {
        const db = client.db(dbName);
        const collection = db.collection("marks");

        collection.find({ "name": "mark" }).toArray((error, results) => {
        if (error) {
 	  console.error(error)
          return;
        }

        response.send(results);
        response.sendStatus(200);
        client.close();
        });
      }
    } catch (error) {
      console.error('Smth wrong. Error', error)
      response.sendStatus(500);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listen ${PORT} port`);
});
