import express from "express"
//routers
import authRouter from "./authRoute"

const router = express.Router()

//routes
router.use("/auth", authRouter)

export default router
