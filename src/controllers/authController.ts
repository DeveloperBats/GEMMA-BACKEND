import { connection } from "../server"
import { Request, Response } from "express"

import bcrypt from "bcrypt"
import { IUser } from "../interfaces"
import Console from "../utils/logger"
import { isEmpty } from "../utils/object"
import { HASTSALTS } from "../constants/hash"

const logger = new Console("AUTH")

export const login = async (_req: Request, _res: Response) => {
    const body: Pick<IUser, "user_nickname" | "user_password" | "user_email"> =
        _req.body || {}
    if (
        isEmpty(body) ||
        typeof body.user_nickname !== "string" ||
        typeof body.user_password !== "string" ||
        body.user_nickname.trim() === "" ||
        body.user_password.trim() === ""
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
            !body.user_password ||
            !body.user_password ||
            body.user_password !== body.user_confirm_password
        ) {
            logger.error("BAD_PAYLOAD[auth/register]", 400)
            res.status(400).json({ status: "BAD_PAYLOAD" }).end()
        }

        body.user_password = await bcrypt.hash(body.user_password, HASTSALTS)
        body.profiles_id = 2
        /*  connection.execute(
            "SELECT * FROM profiles WHERE id=2",
            (err, results, _fields) => {
                const data = results as any[]
                if (err) {
                    logger.error(
                        "Error bringing student profile[auth/register]",
                        500
                    )
                    throw err
                }
                if (data.length <= 0) {
                    logger.error(
                        "error profile data[auth/register]",
                        500
                    )
                    throw new Error("EMPTY_DATA")             
                }
                body.profiles_id  = data[0].id
            }
        ) */

        console.log(body)

        connection.execute(
            `INSERT INTO users (user_name, user_lastname, user_nickname, user_password, user_email, user_profile_image, profiles_id) values ('${body.user_name}','${body.user_lastname}', '${body.user_nickname}', '${body.user_password}', '${body.user_email}', '${body.user_profile_image}', ${body.profiles_id} );`,

            (err, _results, _fields) => {
                /* console.log(err)
                console.log(results) */
                if (err) {
                    logger.error(
                        "Error adding the new user[auth/register]",
                        500
                    )
                    throw err
                }
                let id_last : number = -1
                connection.execute(
                    "SELECT max(id) AS 'id' FROM users;",
                    (err, results, _fields) => {
                        const data = results as any[]
                        if(err) {
                            logger.error(
                                "Error getting the last user ID[auth/register]",
                                500
                            )
                            throw err
                        }
                        if (data.length <= 0) {
                            logger.error(
                                "error id_last data[auth/register]",
                                500
                            )
                            throw new Error("EMPTY_DATA")             
                        }
                        console.log(data[0].id)
                        id_last = data[0].id
                    }
                )
                console.log(id_last)

                const codes : string[] = []
                let stcodes : string = "INSERT INTO masterkeys (ms_active, users_id, code) VALUES" 
                for (let index = 0; index < 10; index++) {
                    let code : string;
                    do {
                        code = Math.floor((Math.random() * (99999 - 10000 + 1) + 10000)).toString()
                        
                    } while (codes.find(item => item === code));
                    codes.push(code);
                    if (index == 9) {
                        stcodes += `(1, ${id_last}, '${code}');`
                    }else{
                        stcodes += `(1, ${id_last}, '${code}'), `
                    }
                }
                console.log(stcodes)
                connection.execute(
                    stcodes,
                    (err, _results, _fields) => {
                        if(err) {
                            logger.error(
                                "Error inserting the masrterkeys[auth/register]",
                                500
                            )
                            throw err
                        }
                        res.status(200).json({ status: "SUCCESFULLY" }).end()
                    }
                )
            }
        )
    } catch (error) {
        logger.error("SERVER_ERROR[auth/register]", 500)
    }
}
