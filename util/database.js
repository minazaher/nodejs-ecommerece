const Sequelize = require('sequelize')

// returns a connection pool which is a promise
const sequelize = new Sequelize('node_ecomm', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost'
})


module.exports = sequelize