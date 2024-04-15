const mongoose = require("mongoose");
const MONGODB_URI = `mongodb://mongodb:27017/ClinicAppointmentSystem`; // Update to use the service name of the MongoDB container

const connectDatabase = () => {
  mongoose.set("strictQuery", false); // Used to avoid one warning
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `MongoDB Database connected with HOST: ${con.connection.host}`
      );
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};

module.exports = connectDatabase;
