import mysql from "mysql2"
import Console from "../../utils/logger"

const console = new Console("SERVER")
//BD
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

console.debug("connecting to the database GEMMA-BD...")

connection.connect(err => {
    if (err) {
        console.error("cannot connect to the database", 500)
        throw err
    }
    console.success("connection established successfully!", 200)
})

export default connection
