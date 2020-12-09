const { ObjectId } = require('mongodb');
const { getDb } = require('../../utils/mongo');

class Product {
    constructor(title, price, imageUrl, description, id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new ObjectId(id) : null;
        this._userId = userId;
    }

    save() {
        const db = getDb();
        let dbop;
        if (this._id) {
            dbop = db.collection('products').updateOne({ _id: this._id }, { $set: this });
        } else {
            dbop = db.collection('products').insertOne(this);
        }
        return dbop
            .then(result => {
                console.log(result);
            })
            .catch(err => console.error(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products').findOne({ _id: new ObjectId(prodId) });
    }

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new ObjectId(prodId) });
    }
}

module.exports = Product;
