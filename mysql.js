const { createConnection } = require("mysql")
const connection = createConnection({
    host: "localhost",
    user: "root",
    database: "upp",
    password: ""
})

module.exports = function (sql, arr = []) {
    return new Promise(resolve => {
        connection.query(sql, arr, (err, res) => {
            err && console.log(err)
            resolve(err ? [] : res)
        })
    })
}