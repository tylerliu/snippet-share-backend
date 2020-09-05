const DBConnection = require('./DBConnection')
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

const jwtKey = 'JzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydW' // for demonstration only
const expiration_period = "1h"

async function signUp(username, password) {
    const collection = DBConnection.collection('Users')
    const user = await collection.findOne({username: username})
    if (user !== null) throw new Error("User Exists")
    const hash = await bcrypt.hash(password, 2)
    const r = await collection.insertOne({username: username, password: hash});
    if (r.insertedCount === 1) {
        return true;
    }
    else throw new Error("Unauthorized")
}

async function getToken(username, password) {
    const collection = DBConnection.collection('Users')
    const user = await collection.findOne({username: username})
    if (user === null) throw new Error("Unauthorized")
    const ok = await bcrypt.compare(password, user.password)
    if (ok) return jwt.sign({user: username}, jwtKey, {expiresIn: expiration_period})
    else throw new Error("Unauthorized")
}

function verifyToken(token){
    try {
        const decoded = jwt.verify(token, jwtKey)
        return decoded.user
    } catch (e) {
        return null;
    }
}

module.exports = {signUp, getToken, verifyToken}
