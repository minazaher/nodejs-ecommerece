const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'node_ecomm',
    password:'root'
})

module.exports = pool.promise()