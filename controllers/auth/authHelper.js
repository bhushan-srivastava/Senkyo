import Users from "../../models/user/user.model.js"
import Admins from "../../models/admin/admin.model.js"

async function loadCurrentUser(req, res, next) {
    try {
        if (!req.auth?.userId || !req.auth?.role || !req.auth?.token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.auth.role === "admin") {
            const admin = await Admins.findById(req.auth.userId).select("-password");
            if (!admin) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!admin.activeTokens?.includes(req.auth.token)) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.auth.user = admin;
            req.auth.isAdmin = true;
            return next();
        }

        if (req.auth.role === "voter") {
            const voter = await Users.findById(req.auth.userId).select("-password");
            if (!voter) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!voter.activeTokens?.includes(req.auth.token)) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!voter.verified) {
                return res.status(401).json({
                    message: "Please wait for an Admin to verify your account. Try logging in after few days",
                });
            }
            req.auth.user = voter;
            req.auth.isAdmin = false;
            return next();
        }

        return res.status(401).json({ message: "Unauthorized" });
    }
    catch (error) {
        res.status(500).json({ message: "Unable to load user" })
    }
}

export { loadCurrentUser }
