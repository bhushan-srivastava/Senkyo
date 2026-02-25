import { getVoters, updateVoter, deleteVoter } from "../../controllers/voter/voter.controller.js"
import { requireAdmin, requireAuth } from "../../controllers/auth/authorization.controller.js"
import { loadCurrentUser } from "../../controllers/auth/authHelper.js"
import { Router } from "express";

const voterRouter = Router();

voterRouter.use(requireAuth, loadCurrentUser, requireAdmin);

voterRouter.route('/').get(getVoters);

voterRouter.route('/:id').put(updateVoter);

voterRouter.route('/:id').delete(deleteVoter);

export default voterRouter;
