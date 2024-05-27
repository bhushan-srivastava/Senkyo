import Users from "../../models/user/user.model.js"

//getting all voter
const getVoters = async (req, res) => {
    try {
        if (!req.body.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const voters = await Users.find();
        res.status(200);
        res.json(voters);
    } catch (error) {
        console.log("error in admin/voter:", error);
        res.status(500);
        res.json(error);
    }
}

//updating user data
const updateVoter = async (req, res) => {

    console.log("/updateVoter called:\t", req.params.id);

    const {
        name,
        email,
        password,
        course,
        division,
        imgCode,
        verified
    } = req.body

    const valuesToUpdate = {
        name,
        email,
        password,
        course,
        division,
        imgCode,
        verified
    }

    try {
        if (!req.body.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const updatedUser = await Users.findByIdAndUpdate(req.params.id, valuesToUpdate, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).send(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
}

//deleting a user
const deleteVoter = async (req, res) => {
    try {
        if (!req.body.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const deletedUser = await Users.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.send(deletedUser);
    } catch (error) {
        res.status(500).send('Server error');
    }
}

export { getVoters, updateVoter, deleteVoter }