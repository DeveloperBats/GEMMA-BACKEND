import express from "express"
import cors from "cors"

import router from "./routes/index"
import Console from "./utils/logger"
import mysql from "mysql2"

const app = express()
const PORT = process.env.PORT || 3000

//BD
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "gemma",
})

//config
app.set("json spaces", 2)
const console = new Console("SERVER")

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
