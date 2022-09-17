import express from "express"
import cors from "cors"
import router from "./routes/index"

const app = express()

//config
app.set("json spaces", 2)

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//router
app.use("/api", router)

export default app
