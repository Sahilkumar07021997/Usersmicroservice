const mongoose = require('mongoose');


const connectDatabase = () => {
    mongoose.set('strictQuery', false); //used to avoiding one warning!
    mongoose.connect(process.env.DB_URI, {
        dbName: process.env.DB_NAME, // Specify the database name here
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con => {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
    })
}


module.exports = connectDatabase