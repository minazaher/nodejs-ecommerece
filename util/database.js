const mongodb = require('mongodb')
const dotenv = require('dotenv').config();
const MongoClient = mongodb.MongoClient

let db
const mongoConnect = (callback) =>{
    MongoClient
        .connect(process.env.MONGO_DATABASE_URI)
        .then(client =>{
            console.log("Connected Successfully!")
            db = client.db('shop')
            callback()
        })
        .catch((err) => {
            console.log("Database Connection Failed Please Try Again")
            throw err
        })
}
const getDb = () => {
    if (db) {
        return db;
    } else {
        throw "no database found";
    }
};


exports.databaseUrl = process.env.MONGO_DATABASE_URI;
exports.mongoConnect = mongoConnect
exports.getDb = getDb
