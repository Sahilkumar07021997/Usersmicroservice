const express = require("express");
const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");

//handling Uncaught exceptions: it should be in the very beginning of ur code!
process.on("uncaughtException", (err) => {
  console.log(`ERROR ${err.stack}`); //u can also console err.message instead of whole stack.
  console.log("Shutting down the server due to uncaught exception😓");
  process.exit(1);
});

//Unhandleds Promise Rejection
process.on("unhandledRejection", function (err) {
  console.log(`ERROR: ${err.stack}`);
  console.log("shutting down the server due to unhandled promise rejection😓");

  server.close(() => {
    process.exit(1);
  });
});

//setting up config file in DEV-environment
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
  console.log(
    "------------You are in development mode dude ⚙️ ---------------------------"
  );
}

//connecting to DATABASE
connectDatabase();

app.get("/health", (req, res) => {
  res.send("User MicroService is running! 🏆");
});

app.listen(process.env.PORT, () => {
  console.log(
    `User microservice started succesfully on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode by ${process.env.DEVELOPER}😎`
  );
  console.log(`Vist => ${process.env.URL}`);
});
