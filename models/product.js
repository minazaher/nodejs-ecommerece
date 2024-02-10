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
    constructor(title) {
        this.title = title
    }

    save(){
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
}