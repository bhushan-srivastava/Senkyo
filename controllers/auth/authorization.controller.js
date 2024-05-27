import jwt from "jsonwebtoken"
import validator from 'validator'
import dotenv from "dotenv"

function requireAuth(req, res, next) {
    try {
        const token = req.cookies.vote;

        if (!token) {
            throw new Error('Unauthorized')
        }

        // check json web token exists & is verified
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!validator.isEmail(decodedToken.email)) {
            throw new Error('Unauthorized') // Invalid email
        }
        req.body.user = {}
        req.body.user.email = decodedToken.email
        next();
    }
    catch (error) {
        res.status(401).json({ message: error.message })
    }
};

function getAuth(req, res) {
    res.status(200).json({ message: 'Authorized', isAdmin: req.body.isAdmin })
}

export { requireAuth, getAuth }