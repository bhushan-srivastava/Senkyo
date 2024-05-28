import validator from 'validator'
import Users from "../../models/user/user.model.js"
import Admins from "../../models/admin/admin.model.js"

async function getUser(req, res, next) {
    try {
        if (!validator.isEmail(req.body.user.email)) {
            throw new Error("Incorrect email")
        }

        let voter = await Users.findOne({ "email": req.body.user.email });
        let admin;

        if (!voter) {
            admin = await Admins.findOne({ "email": req.body.user.email });
            if (!admin) {
                throw new Error("Incorrect email")
            }
        }
        else if (!voter.verified) {
            return res.status(401).json({ message: 'Please wait for an Admin to verify your account. Try logging in after few days' })
        }

        req.body.user = voter || admin
        req.body.isAdmin = admin ? true : false
        next()
    }
    catch (error) {
        res.status(401).json({ message: error.message })
    }
}

export { getUser }