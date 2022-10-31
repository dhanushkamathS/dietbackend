const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

// add & configure middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const URI = "mongodb+srv://dhanush:dhanush@cluster0.cbldq.mongodb.net/dietdb?retryWrites=true&w=majority"

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected ");
  })
  .catch((err) => {
    console.log(err);
    console.log("connection failed");
  });


app.use("/api", require("./routes/api"));

app.get("/",(req,res)=>{
  res.send("welcome to dietapp")
})

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT)
  console.log(`Listening on localhost:${process.env.PORT}`)
})