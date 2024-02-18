const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let db
const mongoConnect = (callback) =>{
    MongoClient
        .connect("mongodb+srv://MinaZaher:QvyBUi6Oq7TbXpks@cluster0.mysoorl.mongodb.net/")
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


exports.databaseUrl = "mongodb+srv://MinaZaher:QvyBUi6Oq7TbXpks@cluster0.mysoorl.mongodb.net/";
exports.mongoConnect = mongoConnect
exports.getDb = getDb
