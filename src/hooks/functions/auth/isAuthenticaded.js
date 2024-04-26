import { AUTH_INVALID_TOKEN, AUTH_NO_TOKEN } from "../../../libs/error.js"

export const isAuthenticated = (app) => async (req, rep) => {
    if (!req.headers['x-access-token']) throw new AUTH_NO_TOKEN()

    try {
        const user = app.jwt.verify(req.headers['x-access-token'])
        req.user = user.username
        return
    } catch (error) {
        req.log.error(error)
        throw new AUTH_INVALID_TOKEN()
    }
}