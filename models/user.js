const ProductModel = require('./product')

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    cart:{
       items: [{productId: {type: Schema.Types.ObjectId, ref: 'Product',required: true}, qty:{type:Number, required:true}}]
    },
})

userSchema.methods.addToCart = function (product){
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    console.log("index is ",cartProductIndex)
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].qty + 1;
        updatedCartItems[cartProductIndex].qty = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            qty: newQuantity
        });
    }
    this.cart = {
        items: updatedCartItems
    }
    return this.save()
}

userSchema.methods.deleteFromCart = function (productId){
    const updatedCartItems = this.cart.items.filter(p => {
        return p.productId.toString() !== productId.toString()
    })

    this.cart = {
        items: updatedCartItems
    }
    return this.save()

}

/*
class User {
    constructor(id, username, email, cart) {
        this._id = id
        this.name = username
        this.email = email
        this.cart = cart
    }

    static findById(userId) {
        const db = getDb()
        return db.collection('users')
            .find({_id: new mongodb.ObjectId(userId)})
            .next()
    }

    save() {
        const db = getDb()
        return db.collection('users')
            .insertOne(this)
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity
            });
        }
        return this.updateCartItems(updatedCartItems)
    }

    deleteFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(p => {
            return p.productId.toString() !== productId.toString()
        })
        return this.updateCartItems(updatedCartItems)
    }

    updateCartItems(updatedCartItems) {
        const db = getDb()
        return db.collection('users')
            .updateOne({_id: new mongodb.ObjectId(this._id)},
                {$set: {cart: {items: updatedCartItems}}})
    }

    async fetchCartItems() {
        let displayedItems = []
        const currentCart = [...this.cart.items]
        for (let product of currentCart) {
            try {
                let p = await ProductModel.findById(product.productId)
                displayedItems.push({...p, quantity: product.quantity})
            } catch (err) {
                console.log(err)
            }
        }
        console.log(displayedItems)
        return displayedItems
    }

    addOrder() {
        const db = getDb()
        let order;
        return this.fetchCartItems().then(products => {
            order = {
                items: products, user: {
                    id: new mongodb.ObjectId(this._id),
                    name: this.name
                }
            }
            return db
                .collection('orders')
                .insertOne(order)
        })
            .then(() => {
                return this.updateCartItems([])
            })
            .catch(err => console.log(err))
    }

    getOrders(){
        const db = getDb()
        return db
            .collection('orders')
            .find({ 'user.id': new mongodb.ObjectId(this._id)})
            .toArray()

    }
}
*/
module.exports = mongoose.model('User', userSchema);