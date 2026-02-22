import { getAllElections, getElectionByID, createElection, adminUpdateElection, voterUpdateElection } from '../../controllers/election/elections.controller.js'
import { requireAdmin, requireAuth, requireVoter } from "../../controllers/auth/authorization.controller.js"
import { loadCurrentUser } from "../../controllers/auth/authHelper.js"
import { Router } from "express";

const electionRouter = Router();

electionRouter.use(requireAuth, loadCurrentUser);

electionRouter.route('/').get(getAllElections);

electionRouter.route('/:id').get(getElectionByID);

electionRouter.route('/').post(requireAdmin, createElection);

electionRouter.route('/:id').put(requireAdmin, adminUpdateElection);

electionRouter.route('/:id').patch(requireVoter, voterUpdateElection);

export default electionRouter;
