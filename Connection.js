const mysql = require("mysql");
require("dotenv").config();
const con = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_UASERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

con.connect((err) => {
    err ? console.log(err) : console.log("DataBase Connected !!! ")
})

module.exports = con;