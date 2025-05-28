import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js";

const app = express();

// parse the json data 
app.use(express.json());

// connecting to the database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Database Connection Error", err.message);
  });

const port = process.env.PORT || 3000;


// routes

app.use("/api/v1/auth", authRouter);


// global error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// start the server 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});