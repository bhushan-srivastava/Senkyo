import Users from "../../models/user/user.model.js"
import bcrypt from "bcrypt"

//getting all voter
const getVoters = async (req, res) => {
    try {
        if (!req.auth.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const voters = await Users.find().select("-password");
        res.status(200).json(voters);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

//updating user data
const updateVoter = async (req, res) => {
    const {
        name,
        email,
        password,
        course,
        division,
        gender,
        imgCode,
        verified
    } = req.body

    try {
        if (!req.auth.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const valuesToUpdate = {
            name,
            email,
            course,
            division,
            gender,
            imgCode,
            verified
        }

        if (password && !password.startsWith(process.env.SECRET || "")) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
            valuesToUpdate.password = await bcrypt.hash(password, saltRounds);
        } else if (password) {
            valuesToUpdate.password = password;
        }

        Object.keys(valuesToUpdate).forEach((key) => {
            if (valuesToUpdate[key] === undefined) {
                delete valuesToUpdate[key];
            }
        });

        const updatedUser = await Users.findByIdAndUpdate(req.params.id, valuesToUpdate, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

//deleting a user
const deleteVoter = async (req, res) => {
    try {
        if (!req.auth.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const deletedUser = await Users.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: "Voter deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export { getVoters, updateVoter, deleteVoter }
