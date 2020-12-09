const { ObjectId } = require('mongodb');
const { getDb } = require('../../utils/mongo');

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart; // {items:[]}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        let cartProductIndex = -1
        let updatedCartItems = [];
        if (this.cart) {
            cartProductIndex = this.cart.items.findIndex(cp => {
                return cp._productId.toString() === product._id.toString();
            })
            updatedCartItems = [...this.cart.items];
        }

        let newQuantity = 1;
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ _productId: new ObjectId(product._id), quantity: newQuantity })
        }

        const updatedCart = {
            items: updatedCartItems
        }

        const db = getDb();
        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i._productId;
        })
        return db.collection('products')
            .find({
                _id: {
                    $in: productIds
                }
            }).toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i._productId.toString() === p._id.toString();
                        }).quantity
                    }
                });
            });
    }

    deleteCartItem(productId) {
        const updatedCartItems = this.cart.items.filter(i => {
            return i._productId.toString() !== productId
        })

        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: updatedCartItems } } }
        );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        username: this.username
                    }
                }
                return db.collection('orders').insertOne(order);
            })
            .then(result => {
                this.cart = { items: [] };
                return db.collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
            })
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders')
            .find({ 'user._id': new ObjectId(this._id) })
            .toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(userId) });
    }
}

module.exports = User;