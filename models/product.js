const getDb = require('../util/database').getDb
const mongodb = require('mongodb')

class Product {
    constructor(title, price, description, imgUrl, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imgUrl = imgUrl;
        this.userId = userId
    }

    static fetchAll() {
        const db = getDb()
        return  db.collection('products').find().toArray()
            .then(products =>{
              return products
            })
            .catch(err => {
                console.log(err)
            })    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
    }
    static findById(productId){
        const db = getDb();
        return db.collection('products')
            .find({ _id : new mongodb.ObjectId(productId) })
            .next()
            .then((product) =>{
                return product
            })
            .catch(err => {
                console.log(err)
            })
    }

    static deleteById(productId){
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id : new mongodb.ObjectId(productId) })
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
    }

    update(productId){
        const db = getDb();
        return db.collection('products')
            .updateOne({ _id: new mongodb.ObjectId(productId)}, {$set: this})
            .then(()=>{
                console.log("updated successfully")
            })
            .catch(err => {
                console.log(err)
            })
    }

}


module.exports = Product;