const DBConnection = require('./DBConnection')

async function getFileListForView(username) {
    const collection = DBConnection.collection('Files')
    let matches = collection.find({'username': username, 'visible': true}, {'_id': 0})
    return matches.sort([["modified", -1]]).toArray();
}

async function getFile(username, fileName) {
    const collection = DBConnection.collection('Files')
    return collection.findOne({username: username, fileName: fileName})
}

async function getList(username) {
    const collection = DBConnection.collection('Files')
    let matches = collection.find({'username': username}, {'_id': 0})
    return matches.sort([["modified", -1]]).toArray();
}

async function insertFile(username, fileName, content, visible) {
        const collection = DBConnection.collection('Files')
        const result = await collection.updateOne({username: username, fileName: fileName},
            { $setOnInsert: { content: content, created: Date.now(), modified: Date.now(), visible: visible } },
            { upsert: true })
        return result.upsertedCount === 1;
}

async function updateFile(username, fileName, content, visible) {
    const collection = DBConnection.collection('Files')
    const result = await collection.findOneAndUpdate({username: username, fileName: fileName},
            {$set: {content: content, modified: Date.now(), visible: visible}})
    return result.value != null;
}

async function deleteFile(username, fileName) {
    const collection = DBConnection.collection('Files')
    const result = await collection.findOneAndDelete({username: username, fileName: fileName})
    console.log(result);
    return result.value !== null;
}

module.exports = {getFileListForView, getFile, getList, insertFile, updateFile, deleteFile}
