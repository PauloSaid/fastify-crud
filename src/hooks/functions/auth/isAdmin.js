import { AUTH_INVALID_ADMIN_TOKEN, AUTH_NO_ADMIN_TOKEN } from "../../../libs/error.js"

export const isAdmin = (app) => async (req, rep) => {
    if (!req.headers['admin-token']) throw new AUTH_NO_ADMIN_TOKEN()

    try {
        const user = app.jwt.verify(req.headers['admin-token'])
        req.user = user.username
        return
    } catch (error) {
        req.log.error(error)
        throw new AUTH_INVALID_ADMIN_TOKEN()
    }
}