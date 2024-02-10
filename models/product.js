const path = require('path')
const fs = require('fs')
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')

const getProductsFromFile = callback => {
    fs.readFile(p,(err, fileContent) =>{
        if (err){
            return callback([])
        }
        callback(JSON.parse(fileContent))
    })
}

module.exports = class Product{
    constructor(title, imgUrl, description, price) {
        this.title = title
        this.imgUrl = imgUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        this.id = Math.random()
       getProductsFromFile((products =>{
           products.push(this)
           fs.writeFile(p,JSON.stringify(products), (err) => {
               console.log(err)
           })
       }))

    }

    static getAll(callback){
        getProductsFromFile(callback)
    }

    static getProductById(id,callback){
        getProductsFromFile((products) => {
            const product = products.find(p => p.id === id)
            callback(product)
        })
    }
}