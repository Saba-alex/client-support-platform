const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes =require('./routes/user')
const complaintRoutes =require('./routes/complaint')
const adminRoutes =require('./routes/admin')

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With , Content-Type, Accept , Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
});

app.use('/user', userRoutes);
app.use("/complaint", complaintRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
 
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});


mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7fveeqd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
