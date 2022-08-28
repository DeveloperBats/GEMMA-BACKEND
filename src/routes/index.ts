import express from "express"
//routers
import authRouter from "./authRoute"

const router = express.Router()

//authRoute
router.use("/auth", authRouter)

export default router
