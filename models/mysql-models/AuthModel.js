const DBConnection = require('./DBConnection')
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

const jwtKey = 'JzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydW' // for demonstration only
const expiration_period = "1h"

async function signUp(username, password) {
    const users = DBConnection.Users
    const hash = await bcrypt.hash(password, 2)
    const {user, created} = await users.findOrCreate({
        where: { username },
        defaults: {username, password: hash}
    })
    if (!created) throw new Error("User Exists")
    return true
}

async function getToken(username, password) {
    const users = DBConnection.Users
    const user = await users.findOne({username: username})
    if (user === null) throw new Error("Unauthorized")
    const ok = await bcrypt.compare(password, user.dataValues.password)
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
