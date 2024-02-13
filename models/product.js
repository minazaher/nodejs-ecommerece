const db = require('../util/database')

const Cart = require('./cart');


const getProductsFromFile = cb => {
};

module.exports = class Product {
    constructor(id, title, imgUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imgUrl = imgUrl;
        this.description = description;
        this.price = price;
    }

    delete() {

    }

    save() {
        return db.execute('INSERT INTO products (title, price,imgUrl, description) values (?,?,?,?)',
            [this.title, this.price, this.imgUrl, this.description])
    }

    static getAll() {
        return db.execute('SELECT * FROM products')
    }

    static getProductById(id) {
      return db.execute('SELECT * FROM products WHERE id = ?'
          ,[id])
    }
};
