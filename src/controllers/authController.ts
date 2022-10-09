const jwt = require("jsonwebtoken")

import connection from "../models/connection/connectionGEMMA"
import { Request, Response } from "express"

import bcrypt from "bcrypt"
import { IUser } from "../interfaces"
import Console from "../utils/logger"
import { isEmpty } from "../utils/object"
import { HASTSALTS } from "../constants/hash"
import {
    ERROR_BAD_REQUEST,
    ERROR_SERVER,
    LOGIN_ERROR,
    RESPONSE_CREATED,
    RESPONSE_OK,
} from "../constants/response"
import { login_query } from "../querys/auth"

const logger = new Console("AUTH")

export const login = async (req: Request, res: Response) => {
    const body: Pick<IUser, "user_nickname" | "user_password" | "user_email"> =
        req.body || {}
    if (
        isEmpty(body) ||
        typeof body.user_nickname !== "string" ||
        typeof body.user_password !== "string" ||
        body.user_nickname.trim() === "" ||
        body.user_password.trim() === ""
    ) {
        console.error("BAD REQUEST", ERROR_BAD_REQUEST.CODE)
        res.status(ERROR_BAD_REQUEST.CODE)
            .json({ status: ERROR_BAD_REQUEST.MESSAGE })
            .end()
    }
    connection.execute(
        login_query(body.user_nickname, body.user_email),
        (err, results, _fields) => {
            const result: any[] = results as any
            if (
                err ||
                !result ||
                typeof result !== "object" ||
                !("user_password" in result[0])
            ) {
                logger.error(
                    "Error fetching login[auth/login]",
                    LOGIN_ERROR.CODE
                )
                throw err
            }
            bcrypt.compare(
                body.user_password,
                result[0].user_password,
                (err, results) => {
                    if (err) {
                        throw err
                    }
                    console.log("Comparetion")
                    console.log(results)
                    if (!results) {
                        res.status(RESPONSE_OK.CODE)
                            .json({ status: "PASSWORD INCORRECT" })
                            .end()
                    }
                }
            )
            const payload = {
                cheked: true,
            }
            const token = jwt.sign(payload, process.env.CODE_PASS, {
                expiresIn: "30min",
            })
            console.log(token)
            res.status(RESPONSE_OK.CODE).json({
                status: RESPONSE_OK.MESSAGE,
                data: { token: token },
            })
        }
    )
    /*     res.end() */
}

export const register = async (req: Request, res: Response) => {
    try {
        let body: IUser = req.body

        if (
            !body.user_password ||
            !body.user_confirm_password ||
            body.user_password !== body.user_confirm_password
        ) {
            logger.error("BAD_PAYLOAD[auth/register]", ERROR_BAD_REQUEST.CODE)
            res.status(ERROR_BAD_REQUEST.CODE)
                .json({ status: ERROR_BAD_REQUEST.MESSAGE })
                .end()
        }

        body.user_password = await bcrypt.hash(body.user_password, HASTSALTS)
        body.profiles_id = 4

        console.log(body)

        connection.execute(
            `INSERT INTO users 
            (user_name, 
            user_lastname, 
            user_nickname, 
            user_password, 
            user_email, 
            user_profile_image, 
            profiles_id) 
            values 
            ('${body.user_name}',
            '${body.user_lastname}', 
            '${body.user_nickname}', 
            '${body.user_password}', 
            '${body.user_email}', 
            '${body.user_profile_image}', 
            ${body.profiles_id});`,
            (err, results, _fields) => {
                if (err) {
                    logger.error(
                        "Error adding the new user[auth/register]",
                        ERROR_SERVER.CODE
                    )
                    throw err
                }

                console.log("RESULTS QUERY")
                console.log(results)

                const id_last: number =
                    "insertId" in results ? results?.insertId : -1

                console.log(id_last)

                const codes: string[] = []
                let stcodes: string =
                    "INSERT INTO masterkeys (ms_active, users_id, code) VALUES "
                for (let index = 0; index < 10; index++) {
                    let code: string
                    do {
                        code = Math.floor(
                            Math.random() * (99999 - 10000 + 1) + 10000
                        ).toString()
                    } while (codes.find(item => item === code))
                    codes.push(code)
                    if (index === 9) {
                        stcodes += `(1, ${id_last}, '${code}');`
                    } else {
                        stcodes += `(1, ${id_last}, '${code}'), `
                    }
                }

                console.log(stcodes)

                connection.execute(stcodes, (err, _results, _fields) => {
                    if (err) {
                        logger.error(
                            "Error inserting the masrterkeys[auth/register]",
                            ERROR_SERVER.CODE
                        )
                        throw err
                    }
                    res.status(RESPONSE_CREATED.CODE)
                        .json({ status: RESPONSE_CREATED.MESSAGE })
                        .end()
                })
            }
        )
    } catch (error) {
        logger.error("SERVER_ERROR[auth/register]", ERROR_SERVER.CODE)
    }
}
