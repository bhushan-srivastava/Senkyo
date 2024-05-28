import { getVoters, updateVoter, deleteVoter } from "../../controllers/voter/voter.controller.js"
import { requireAuth } from "../../controllers/auth/authorization.controller.js"
import { getUser } from "../../controllers/auth/authHelper.js"
import { Router } from "express";

const voterRouter = Router();

voterRouter.route('/').get(requireAuth, getUser, getVoters);

voterRouter.route('/:id').put(requireAuth, getUser, updateVoter);

voterRouter.route('/:id').delete(requireAuth, getUser, deleteVoter);

export default voterRouter;