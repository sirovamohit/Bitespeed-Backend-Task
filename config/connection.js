const constants = require('./config');
const mysql = require('mysql2');

class DB {
    constructor() {
        global.slave_pool = this.create_connection_pool(constants.User);
    }
    create_connection_pool = (credentials) => {
        return mysql.createPool({
            host: credentials.host,
            user: credentials.user,
            password: credentials.password,
            database: credentials.database,
            waitForConnections: true,
            connectionLimit: 10,
            timezone: '+05:30',
            queueLimit: 0
        });
    }
    query = async (query, params, log) => {
        return new Promise(function (resolve, reject) {
            slave_pool.query(query, params, function (err, rows) {
                if (log) {
                    console.log(this.sql);
                    console.log("\n");
                }
                if (err) {
                    return reject(err)
                }
                return resolve(rows)
            })
        })
    }
}
module.exports = new DB();