const mongoose = require("mongoose");

const url = `mongodb+srv://react_mongo:vijki%40469react@reactmongo.ysyycyw.mongodb.net/chat_app?retryWrites=true&w=majority`;

const options = {
  autoIndex: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  family: 4,
};

mongoose.set('strictQuery', true);
mongoose
  .connect(url, options)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

const db = mongoose.connection;

module.exports = db;
