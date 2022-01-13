//importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import cors from "cors";
import Pusher from "pusher";
import envFile from "dotenv";

envFile.config();
///
//app-config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
  appId: "1330746",
  key: "8a8afec091eee9d5ce31",
  secret: "2c4b6f7e2dfb03aae629",
  cluster: "mt1",
  useTLS: true,
});

//middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

//DB config
const connection_url = process.env.DB;
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher
        .trigger("messages", "inserted", {
          name: messageDetails.name,
          message: messageDetails.message,
          timestamp: messageDetails.timestamp,
          id: messageDetails._id,
          received: messageDetails.received,
        })
        .catch((err) => console.log("Error triggering Pusher"));
    }
  });
});

//api routes
app.get("/", (req, res, next) => {
  res.status(200).send("hello world");
});

app.get("/messages/sync", (req, res, next) => {
  Messages.find({})
    .lean()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(500).send(err));
});

app.post("/api/messages/new", (req, res, next) => {
  const dbMessage = req.body;
  //console.log(dbMessage);
  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(`new message created: \n ${data}`);
    }
  });
});

//listen
app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
