import { login } from "../../controllers/authController"
import express from "express"
import { connection } from "../../server"

const authRouter = express.Router()

authRouter.post("/login", login)

authRouter.get("/register", (_req, res) => {
    connection.execute("select * from users", (err, results, fields) => {
        console.log(err)
        console.log(results)
        console.log(fields.map(item => item.name))
    })
    res.status(200)
        .json({ email: "omararenas@gmail.com", user: "Omar", pass: "41545" })
        .end()
})

export default authRouter
