import { Request, Response } from "express"

import { User } from "../interfaces"
import Console from "../utils/logger"
import { isEmpty } from "../utils/object"

const console = new Console("AUTH")

export const login = async (_req: Request, _res: Response) => {
    const body: Pick<User, "user" | "pass"> = _req.body || {}
    if (
        isEmpty(body) ||
        typeof body.user !== "string" ||
        typeof body.pass !== "string" ||
        body.user.trim() === "" ||
        body.pass.trim() === ""
    ) {
        console.error("BAD REQUEST", 400)
        _res.status(400).json({ status: "BAD_REQUEST" }).end()
    }
}
