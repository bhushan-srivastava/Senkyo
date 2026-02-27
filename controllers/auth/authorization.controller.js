import jwt from "jsonwebtoken"
import validator from 'validator'

const VALID_ROLES = new Set(["admin", "voter"]);
const ACCESS_TOKEN_COOKIE = "access_token";

function getTokenFromCookieHeader(cookieHeader) {
    if (!cookieHeader || typeof cookieHeader !== "string") return null;

    const cookies = cookieHeader.split(";");
    for (const cookiePart of cookies) {
        const [rawName, ...rawValueParts] = cookiePart.trim().split("=");
        if (rawName === ACCESS_TOKEN_COOKIE) {
            const rawValue = rawValueParts.join("=");
            return decodeURIComponent(rawValue || "").trim() || null;
        }
    }

    return null;
}

function extractToken(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7).trim();
    }

    return getTokenFromCookieHeader(req.headers.cookie);
}

function requireAuth(req, res, next) {
    try {
        const token = extractToken(req);

        if (!token) {
            throw new Error('Unauthorized')
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!validator.isEmail(decodedToken.email) || !VALID_ROLES.has(decodedToken.role)) {
            throw new Error('Unauthorized')
        }

        req.auth = {
            token,
            userId: decodedToken.sub,
            email: decodedToken.email,
            role: decodedToken.role,
            name: decodedToken.name,
            isAdmin: decodedToken.role === "admin",
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized' })
    }
};

function getAuth(req, res) {
    const user = req.auth?.user
    res.status(200).json({
        message: 'Authorized',
        role: req.auth?.role,
        isAdmin: req.auth?.role === "admin",
        user: user ? {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: req.auth?.role,
        } : {
            _id: req.auth?.userId,
            name: req.auth?.name,
            email: req.auth?.email,
            role: req.auth?.role,
        },
    })
}

function requireRole(...roles) {
    return function checkRole(req, res, next) {
        if (!req.auth || !roles.includes(req.auth.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        return next();
    };
}

function requireAdmin(req, res, next) {
    return requireRole("admin")(req, res, next);
}

function requireVoter(req, res, next) {
    return requireRole("voter")(req, res, next);
}

export { requireAuth, getAuth, requireRole, requireAdmin, requireVoter }
