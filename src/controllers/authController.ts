import { connection } from "../server"
import { Request, Response } from "express"

import bcrypt from "bcrypt"
import { IUser } from "../interfaces"
import Console from "../utils/logger"
import { isEmpty } from "../utils/object"
import { HASTSALTS } from "../constants/hash"

const logger = new Console("AUTH")

export const login = async (_req: Request, _res: Response) => {
    const body: Pick<IUser, "nickname" | "password" | "email"> = _req.body || {}
    if (
        isEmpty(body) ||
        typeof body.nickname !== "string" ||
        typeof body.password !== "string" ||
        body.nickname.trim() === "" ||
        body.password.trim() === ""
    ) {
        console.error("BAD REQUEST", 400)
        _res.status(400).json({ status: "BAD_REQUEST" }).end()
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        let body: IUser = req.body

        logger.debug(body)

        if (
            !body.password ||
            !body.password ||
            body.password !== body.confirmPassword
        ) {
            logger.error("BAD_PAYLOAD[auth/register]", 400)
            res.status(400).json({ status: "BAD_PAYLOAD" }).end()
        }

        body.password = await bcrypt.hash(body.password, HASTSALTS)

        connection.execute(
            "INSERT INTO users SET ?",
            [body],

            (err, results, fields) => {
                console.log(err)
                console.log(results)
                if (err) {
                    logger.error(
                        "Error adding the new user[auth/register]",
                        500
                    )
                    throw err
                }
                console.log(fields.map(item => item.name))
                res.status(200).json({ status: "SUCCESFULLY" }).end()
            }
        )
    } catch (error) {
        logger.error("SERVER_ERROR[auth/register]", 500)
    }
}
