const { MongoClient } = require('mongodb');

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://localhost:27017/node_crud?readPreference=primary&ssl=false')
        .then((client) => {
            console.log('connected mongodb');
            this._db = client.db('node_crud');
            callback();
        })
        .catch(err => {
            console.error(err)
            throw err;
        });

}

const getDb = () => {
    if (this._db) {
        return this._db;
    }
    throw 'no database found';
}

module.exports = {
    mongoConnect,
    getDb
};