const DBConnection = require('./DBConnection')

async function getFileListForView(username) {
    const files = DBConnection.Files
    let matches = await files.findAll({
        where: {'username': username, 'visible': true},
        order: [["modified", 'DESC']]
    })
    return matches.map((e) => {
        e = e.dataValues;
        e.modified = e.modified.getTime();
        return e;
    })
}

async function getFile(username, fileName) {
    const files = DBConnection.Files
    let match = await files.findOne({username: username, fileName: fileName})
    if (match === null) return null
    match = match.dataValues
    match.modified = match.modified.getTime()
    return match;
}

async function getList(username) {
    const files = DBConnection.Files
    let matches = await files.findAll({
        where: {'username': username},
        order: [["modified", 'DESC']]
    })
    return matches.map((e) => {
        e = e.dataValues;
        e.modified = e.modified.getTime();
        return e;
    })
}

async function insertFile(username, fileName, content, visible) {
    const files = DBConnection.Files
    const [file, created] = await files.findOrCreate({
        where: {username, fileName},
        defaults: {username, content, visible}
    })
    return created;
}

async function updateFile(username, fileName, content, visible) {
    const files = DBConnection.Files
    const result = await files.update({content, visible}, {
            where: {username, fileName},
            limit: 1
        })
    return result[0] !== 0;
}

async function deleteFile(username, fileName) {
    const files = DBConnection.Files
    const result = await files.destroy({
        where: {username, fileName}
    })
    return result !== 0;
}

module.exports = {getFileListForView, getFile, getList, insertFile, updateFile, deleteFile}
