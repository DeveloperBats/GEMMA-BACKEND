import { login, register } from "../../controllers/authController"
import express from "express"

const authRouter = express.Router()

authRouter.post("/login", login)

authRouter.post("/register", register)

authRouter.get("/test", (_req, _res) => {
    _res.status(200).json({ greetings: "HOLA" }).end()
})

export default authRouter
