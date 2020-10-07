const mongoose = require('mongoose');

module.exports = () => {

    // mongo "mongodb+srv://cluster0.tau9s.mongodb.net/<dbname>" --username viswaPrasath

    mongoose
        .connect(" mongodb+srv://viswaPrasath:ZghhKqofQYrypvrQ@cluster0.tau9s.mongodb.net/PostApp?retryWrites=true&w=majority",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
        )
        .then(() => {
            console.log("MongoDB Connected...")
        })
        .catch((err) => {
               console.log(err.message)
        });
    
    mongoose.connection.on("connected", () => {
        console.log("MongoDB Connecting..");
    });
    
    mongoose.connection.on("error", (error) => {
        console.log(error.message);
    });
    
    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB connection disconnected");
    });
    
    
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
          console.log(
            'Mongoose connection is disconnected due to app termination...'
          );
          process.exit(0);
        });
    });
    
}
  
