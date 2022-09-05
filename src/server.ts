import express from "express"
import cors from "cors"

import router from "./routes/index"
import Console from "./utils/logger"
import mysql from "mysql2"
import "dotenv/config"

const console = new Console("SERVER")

const app = express()
const PORT = process.env.PORT || 3000

//BD
export const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

console.debug("connecting to the database GEMMA-BD...")

connection.connect(err => {
    if (err) {
        console.error("connected to database", 500)
        throw err
    }
})

//config
app.set("json spaces", 2)

//BD
console.debug(`${connection}`)

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//router
app.use("/api", router)

app.listen(PORT, () => {
    console.success(`Server running on port ${PORT}...`, 200)
})


