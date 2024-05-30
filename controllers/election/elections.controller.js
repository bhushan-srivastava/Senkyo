import Elections from "../../models/election/election.model.js"
import calculateResult from './results.js'
import {/* add function names here */ } from './electionScheduler.js'

// auth middleware (authHelper.js) gives a variable 'req.body.isAdmin', this variable is used to check if the request is sent by an admin or a voter
// if (req.body.isAdmin) {//admin use cases}
// else {//voter use cases}
// middleware will give an object 'req.body.user', this stores the user object from the User-DB
// if the user is an admin then req.body.user will store the admin's object from the Admin-DB

async function getAllElections(req, res) {
    // for admin and voter both

    // if voter then send all elections that the user is allowed to vote in. Use course and division field of the elections table
    // Elections.find(courses includes req.body.user.course, division includes req.body.user.division
}

async function getElectionByID(req, res) {
    // admin use cases -->
    // check admin by (req.body.isAdmin === true)
    // get one election by id
    // will be used if admin wants to edit an election thats already created before

    // voter use cases -->
    // will also be used when user needs to visit /:electionID to see details about an election

    // common use cases -->
    // if the admin has set 'resultDeclared = true' then calculate the winners and send the data for bar chart and pie chart
}

async function createElection(req, res) {
    // only if req.body.isAdmin === true
    // only for admin, not for user
}

async function adminUpdateElection(req, res) {
    // admin use cases
    // check admin by (req.body.isAdmin === true)

    // fetch the current version of the election by ID from the DB
    // then compare the current version's 'status' and 'date' fields with the new version's respective fields to check if admin has changed the dates of the election
    // if admin has changes the any 'date' of the election then change the 'status' accordingly
    // Eg. if admin changes the registrationEnd date from 20/05/24 to 22/05/24 and today is 21/05/24 then the status must be changed from 'Pending' to 'Registration'

    // the results are not declared even after the election ends
    // the admin has to send a request with 'resultDeclared = true' and only then we calculate the result and declare it using the 'results.js' file 
}

async function voterUpdateElection(req, res) {
    /* voter use cases via PATCH request to /:electionID
     
     * user can register themself 
     * user can withdraw their own registration 
     
     * user can give their vote
     * user can vote only once per election (check reference code below)
     * see MDN Docs for difference between PUT and PATCH and use ChatGPT for the code for PUT and PATCH

    */
}

async function deleteElection(req, res) {
    // only for admin, not for user
    // only if req.body.isAdmin === true
}

export { getAllElections, getElectionByID, createElection, adminUpdateElection, voterUpdateElection, deleteElection }

/*

// reference code for adding a vote from ChatGPT

async function addVote(userId, electionId, candidateId) {
    try {
        // Find the election
        const election = await Elections.findById(electionId);
        if (!election) {
            throw new Error('Election not found');
        }

        // Check if the election is ongoing
        if (election.status !== 'Ongoing') {
            throw new Error('Voting is not currently ongoing for this election');
        }

        // Check if the user has already voted
        const alreadyVoted = election.votersWhoHaveVoted.some(voter => voter.voterID.equals(userId));
        if (alreadyVoted) {
            throw new Error('You have already voted in this election');
        }

        // Find the candidate
        const candidate = election.candidates.find(candidate => candidate.candidateID.equals(candidateId));
        if (!candidate) {
            throw new Error('Candidate not found');
        }

        // Update the number of votes received by the candidate
        candidate.noOfVotesReceived++;

        // Add the voter to the list of voters who have voted in the election
        election.votersWhoHaveVoted.push({ voterID: userId });

        // Save the updated election
        await election.save();

        console.log('Vote added successfully');
    } catch (error) {
        console.error('Error adding vote:', error.message);
    }
}

// Usage example
const userId = 'user_id_here'; // User's ID
const electionId = 'election_id_here'; // Election's ID
const candidateId = 'candidate_id_here'; // Candidate's ID
addVote(userId, electionId, candidateId);


// In this function:

//     We first find the election by its ID.
//     We check if the election is ongoing and if the user has already voted in this election.
//     We find the candidate by their ID and update the noOfVotesReceived field.
//     We add the user to the list of voters who have voted in the election.
//     Finally, we save the updated election.


*/