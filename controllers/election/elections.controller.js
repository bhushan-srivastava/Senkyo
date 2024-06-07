import Elections from "../../models/election/election.model.js"
import calculateResult from './results.js'

async function getAllElections(req, res) {
    try {
        let elections;

        let dbQuery = {};

        // Check if the request is from a voter
        if (!req.body.isAdmin) {
            // If it's a voter, filter elections based on course and division
            dbQuery.course = req.body.user.course;
            dbQuery.division = req.body.user.division;
        }

        // Determine pagination parameters
        const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
        const limit = parseInt(req.query.limit) || 5; // Number of elections per page, default to 5 if not provided

        // Calculate the index of the first election for the current page
        const startIndex = (page - 1) * limit;

        // Query elections from the database with pagination
        /*  elections = await Elections.find(dbQuery)
              .select('-description') // Exclude the description field
              .skip(startIndex) // Skip elections before the current page
              .limit(limit) // Limit the number of elections per page
              .populate({
                  path: 'candidates',
                  select: 'candidateID',
                  options: { limit: 2 } // Limit to the first 2 candidates per election
              })
              .populate({
                  path: 'candidates.candidateID',
                  select: 'imgCode'
              })
  */

        // Query elections from the database with pagination
        elections = await Elections.aggregate([
            { $match: dbQuery }, // Match the elections based on the query
            { $project: { description: 0 } }, // Exclude the description field
            { $skip: startIndex }, // Skip elections before the current page
            { $limit: limit }, // Limit the number of elections per page
            {
                $lookup: {
                    from: 'users', // The collection to join with
                    localField: 'candidates.candidateID', // The field from the current collection
                    foreignField: '_id', // The field from the joined collection
                    as: 'candidatesData' // The alias for the joined data
                }
            },
            { $unwind: '$candidatesData' }, // Unwind the candidates array
            {
                $project: {
                    title: 1,
                    numberOfWinners: 1,
                    course: 1,
                    division: 1,
                    status: 1,
                    registrationStart: 1,
                    registrationEnd: 1,
                    votingStart: 1,
                    votingEnd: 1,
                    resultDeclared: 1,
                    candidateImages: { $slice: ['$candidatesData.imgCode', 2] } // Get the images of the first 2 candidates
                }
            }
        ]);


        res.status(200).json(elections);
    } catch (error) {
        console.error('Error fetching elections:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

async function getElectionByID(req, res) {
    try {
        const { electionID } = req.params;

        // Find the election by ID and populate the candidates' data
        const election = await Elections.findById(electionID)
            .populate({
                path: 'candidates.candidateID',
                select: 'name imgCode' // Select only the name and image code of the candidate
            });

        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        // Otherwise, return the election data without results
        return res.satus(200).json({ election });
    } catch (error) {
        console.error("Error retrieving election by ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function createElection(req, res) {

    try {

        if (!req.body.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Extract data from request body
        const { title, description, numberOfWinners, course, division, registrationStart, registrationEnd, votingStart, votingEnd } = req.body;

        registrationStart = new Date(registrationStart);
        registrationEnd = new Date(registrationEnd);
        votingStart = new Date(votingStart);
        votingEnd = new Date(votingEnd);

        const today = new Date();

        registrationStart.setHours(0, 0, 0, 0);
        registrationEnd.setHours(0, 0, 0, 0);
        votingStart.setHours(0, 0, 0, 0);
        votingEnd.setHours(0, 0, 0, 0);

        today.setHours(0, 0, 0, 0);

        if (registrationStart < today) {
            return res.status(400).json({
                message: "Registration Start Date cannot be before Today's Date"
            });
        }

        // Create new election instance
        const newElection = new Elections({
            title,
            description,
            numberOfWinners,
            course,
            division,
            // status,
            registrationStart,
            registrationEnd,
            votingStart,
            votingEnd,
            resultDeclared: false, // Set resultDeclared to false by default
            result: {},
            candidates: [], // Initialize candidates array
            votersWhoHaveVoted: [] // Initialize votersWhoHaveVoted array
        });



        if (registrationStart <= today && today <= registrationEnd) {
            newElection.status = 'Registration';
        }
        else {
            newElection.status = 'Pending';
        }


        // Save the new election to the database
        const savedElection = await newElection.save();

        // Respond with the newly created election
        res.status(201).json(savedElection);
    } catch (error) {
        // Handle errors
        console.error('Error creating election:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function adminUpdateElection(req, res) {
    try {
        // Check if the request is from an admin
        if (!req.body.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { electionID } = req.params;

        // Fetch the current version of the election by ID from the database
        const election = await Elections.findById(electionID);

        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }


        const { user, isAdmin, ...updates } = req.body;

        const newRegistrationStart = new Date(updates.registrationStart);
        const newRegistrationEnd = new Date(updates.registrationEnd);
        const newVotingStart = new Date(updates.votingStart)
        const newVotingEnd = new Date(updates.votingEnd)

        const today = new Date();

        newRegistrationStart.setHours(0, 0, 0, 0);
        newRegistrationEnd.setHours(0, 0, 0, 0);
        newVotingStart.setHours(0, 0, 0, 0);
        newVotingEnd.setHours(0, 0, 0, 0);

        today.setHours(0, 0, 0, 0);

        if (newRegistrationStart <= today && today < newRegistrationEnd) {
            election.status = 'Registration';
        }
        else if (newRegistrationEnd < today) {
            if (newVotingStart <= today && today < newVotingEnd) {
                election.status = 'Ongoing';
            }
            else if (newVotingEnd <= today) {
                election.status = 'Finished';
                election.result = calculateResult(election);
            }
            else {
                election.status = 'Pending';
            }
        }

        // Update the election's dates
        election.registrationStart = newRegistrationStart;
        election.registrationEnd = newRegistrationEnd;
        election.votingStart = newVotingStart;
        election.votingEnd = newVotingEnd;

        election.title = updates.title || election.title;
        election.description = updates.description || election.description;
        election.numberOfWinners = updates.numberOfWinners || election.numberOfWinners;
        election.course = updates.course || election.course;
        election.division = updates.division || election.division;

        // Save the updated election
        await election.save();

        res.status(200).json({ message: "Election updated successfully", election });
    } catch (error) {
        console.error("Error updating election:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function voterUpdateElection(req, res) {
    /* voter use cases via PATCH request to /:electionID
     
     * user can register themself 
     * user can withdraw their own registration 
     * user's course and division should be present in the election's courses[] and divisions[]
     
     * user can give their vote
     * user can vote only once per election (check reference code below)
     * see MDN Docs for difference between PUT and PATCH and use ChatGPT for the code for PUT and PATCH
 
    */
}

export { getAllElections, getElectionByID, createElection, adminUpdateElection, voterUpdateElection }

/*

// reference code for adding a vote from ChatGPT

async function addVote(userId, electionId, candidateId) {
    try {
        // Find the election
        const election = await Elections.findById(electionId);
        if (!election) {
            throw new Error('Elections not found');
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
const electionId = 'election_id_here'; // Elections's ID
const candidateId = 'candidate_id_here'; // Candidate's ID
addVote(userId, electionId, candidateId);


// In this function:

//     We first find the election by its ID.
//     We check if the election is ongoing and if the user has already voted in this election.
//     We find the candidate by their ID and update the noOfVotesReceived field.
//     We add the user to the list of voters who have voted in the election.
//     Finally, we save the updated election.


*/