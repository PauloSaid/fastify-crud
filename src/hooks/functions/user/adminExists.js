import { ADMIN_PROPERTY_FALSE } from "../../../libs/error.js"

export const AdminExists = (app) => async (req, rep) => {
    if (!req.body.isAdmin) {
        throw new ADMIN_PROPERTY_FALSE();
    }
}