import { login } from "@controllers/authController"
import express from "express"

const authRouter = express.Router()

authRouter.post("/login", login)

authRouter.get("/register", (_req, res) => {
    res.status(200)
        .json({ email: "omararenas@gmail.com", user: "Omar", pass: "41545" })
        .end()
})

export default authRouter
