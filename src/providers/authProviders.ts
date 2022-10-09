export function verifyToken(req: any, res: any, next: any) {
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[0]
        req.token = bearerToken
        next()
    } else {
        res.status(403)
    }
}
