

//Connection URL
const {Sequelize, DataTypes} = require("sequelize");

const host = 'localhost';
const username = '';
const password = '';

//Database Name
const dbName = 'SnippetShareServer';

class MySQLConnector{
    Files = null;
    Users = null;

    constructor() {
        let sequelize = new Sequelize(dbName, username, password, {
            host: host,
            dialect: 'mysql'
        });
        this.Files = sequelize.define('File', {
            // Model attributes are defined here
            username: {type: DataTypes.STRING(40), allowNull: false, primaryKey: true},
            fileName: {type: DataTypes.STRING(256), allowNull: false, primaryKey: true},
            content:  {type: DataTypes.TEXT, allowNull: false},
            visible:  {type: DataTypes.BOOLEAN, allowNull: false},
        }, {
            timestamps: true,
            createdAt: false,
            updatedAt: 'modified'
        });

        this.Users = sequelize.define('User', {
            // Model attributes are defined here
            username: {type: DataTypes.STRING(40), allowNull: false, primaryKey: true},
            password: {type: DataTypes.STRING(256), allowNull: false}
        }, {timestamps: false});

        sequelize.authenticate()
            .then(() =>
                console.log('Connection has been established successfully.')
            ).catch((error) =>
                console.error('Unable to connect to the database:', error)
            )
    }


}

module.exports = new MySQLConnector();
