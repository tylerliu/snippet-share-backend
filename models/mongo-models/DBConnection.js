const MongoClient = require('mongodb').MongoClient;

//Connection URL
const url = 'mongodb://localhost:27017';

//Database Name
const dbName = 'SnippetShareServer';


class MongoConnector{
    db = null;

    constructor() {
        let client = new MongoClient(url)
        client.connect()
            .then(() => {
            this.db = client.db(dbName);
            })
            .catch((err) => {
                console.log("Database Initialization error")
                process.exit(1);
            })
    }

    collection(collection) {
        if (this.db != null) return this.db.collection(collection)
        throw new Error("Database Initialization error")
    }
}

module.exports = new MongoConnector();
