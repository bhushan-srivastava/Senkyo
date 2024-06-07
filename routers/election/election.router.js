import { getAllElections, getElectionByID, createElection, adminUpdateElection, voterUpdateElection } from '../../controllers/election/elections.controller.js'
import { requireAuth } from "../../controllers/auth/authorization.controller.js"
import { getUser } from "../../controllers/auth/authHelper.js"
import { Router } from "express";

const electionRouter = Router();

electionRouter.route('/?page&limit').get(requireAuth, getUser, getAllElections);

electionRouter.route('/:id').get(requireAuth, getUser, getElectionByID);

electionRouter.route('/:id').post(requireAuth, getUser, createElection);

electionRouter.route('/:id').put(requireAuth, getUser, adminUpdateElection);

electionRouter.route('/:id').patch(requireAuth, getUser, voterUpdateElection);

export default electionRouter;