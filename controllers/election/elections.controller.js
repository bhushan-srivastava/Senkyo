import Elections from "../../models/election/election.model.js"
import Users from "../../models/user/user.model.js"
import {
    blockchainAddElection,
    blockchainGetAllElections,
    blockchainAddCandidate,
    blockchainVote,
    // blockchainGetCandidate, 
    blockchainGetElectionTitle,
    // blockchainGetAllCandidates, 
    blockchainRemoveCandidate,
    blockchainToggleElectionStatus,
    blockchainChangeElectionTitle,
    blockchainGetAllCandidates
} from "../blockchain/blockchainScripts.js";

async function getAllElections(req, res) {
    try {
        let dbQuery = {};

        // Check if the request is from a voter
        if (!req.body.isAdmin) {
            dbQuery.courses = { $in: [req.body.user.course] };
            dbQuery.divisions = { $in: [req.body.user.division] };
        }

        // Additional filtering based on query parameters
        if (req.query.status) {
            dbQuery.status = req.query.status; // Filter by status
        }
        if (req.query.courses) {
            dbQuery.courses = { $in: req.query.courses.split(',') }; // Filter by courses
        }
        if (req.query.divisions) {
            dbQuery.divisions = { $in: req.query.divisions.split(',') }; // Filter by divisions
        }
        if (req.query.genders) {
            dbQuery.genders = { $in: req.query.genders.split(',') }; // Filter by genders
        }

        // Filter by registration dates
        if (req.query.registrationStart) {
            dbQuery.registrationStart = { $gte: new Date(req.query.registrationStart) }; // Start date
        }
        if (req.query.registrationEnd) {
            dbQuery.registrationEnd = { $lte: new Date(req.query.registrationEnd) }; // End date
        }

        // Filter by voting dates
        if (req.query.votingStart) {
            dbQuery.votingStart = { $gte: new Date(req.query.votingStart) }; // Start date
        }
        if (req.query.votingEnd) {
            dbQuery.votingEnd = { $lte: new Date(req.query.votingEnd) }; // End date
        }

        // Query elections from the database without pagination
        const elections = await Elections.find(dbQuery)
            .select('-description -votersWhoHaveVoted') // Exclude the description field
            .sort({ registrationStart: -1 }) // Sort by registrationStart field in descending order
            .populate({
                path: 'candidates.candidateID',
                model: 'users',
                select: 'imgCode'
            })
            .lean(); // Convert Mongoose documents to plain JavaScript objects

        // Process the candidates' images
        elections.forEach(election => {
            election.candidatesImages = election.candidates.slice(0, 2).map(candidate => candidate.candidateID?.imgCode);
            delete election.candidates; // Remove the candidates field
        });

        // Checking blockchain connection
        // await blockchainGetAllElections();

        res.status(200).json(elections);
    } catch (error) {
        console.error('Error fetching elections:', error);
        res.status(500).json({ error: error.message });
    }
}


async function getElectionByID(req, res) {
    try {

        const { id } = req.params;

        console.log("Req to getElectionByID 1:\t", req.params);
        // Find the election by ID and populate the candidates' data
        const election = await Elections.findById(id)
            .select('-__v -createdAt -updatedAt');

        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        // check if the voter is allowed to access the requested election
        if (!req.body.isAdmin) {
            if (!election.courses.includes(req.body.user.course) || !election.divisions.includes(req.body.user.division)) {
                return res.status(403).json({ message: "You are not allowed to access this election" });
            }
        }

        const formattedCandidates = await Promise.all(election.candidates.map(async (candidate) => {
            const user = await Users.findById(candidate.candidateID.toString());
            const candidateData = {
                // _id: user._id,
                _id: candidate.candidateID,
                name: user.name,
                email: user.email,
                course: user.course,
                division: user.division,
                gender: user.gender,
                imgCode: user.imgCode,
            };

            if (election.status == 'Finished') {
                try {
                    const blockchainNoOfVotesReceived = await blockchainGetAllCandidates(id);

                    console.log('got all candidates from blockchain for election', election.title, blockchainNoOfVotesReceived);

                    candidateData.noOfVotesReceived =
                        Object.hasOwn(blockchainNoOfVotesReceived, candidate.candidateID) ?
                            blockchainNoOfVotesReceived[candidate.candidateID]
                            :
                            candidate.noOfVotesReceived;

                } catch (blockchainError) {
                    console.error('Error getting all candidates from blockchain:', blockchainError);
                    candidateData.noOfVotesReceived = candidate.noOfVotesReceived;
                }
            }

            return candidateData;
        }));

        // remove if error
        formattedCandidates.sort((candidate1, candidate2) => candidate2.noOfVotesReceived - candidate1.noOfVotesReceived)

        const formattedVoters = election.votersWhoHaveVoted.map(voter => voter.voterID);

        const formattedElection = {
            ...election.toObject(),
            candidates: formattedCandidates,
            votersWhoHaveVoted: formattedVoters
        };

        res.status(200).json(formattedElection);
    } catch (error) {
        console.error("Error retrieving election by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function createElection(req, res) {

    try {

        if (!req.body.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Extract data from request body
        let { title, description, numberOfWinners, courses, divisions, genders, registrationStart, registrationEnd, votingStart, votingEnd } = req.body;

        registrationStart = new Date(registrationStart);
        registrationEnd = new Date(registrationEnd);
        votingStart = new Date(votingStart);
        votingEnd = new Date(votingEnd);

        registrationStart.setHours(0, 0, 0, 0);
        registrationEnd.setHours(0, 0, 0, 0);
        votingStart.setHours(0, 0, 0, 0);
        votingEnd.setHours(0, 0, 0, 0);

        // console.log(registrationStart, registrationEnd, votingStart, votingEnd);

        const today = new Date();
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
            courses,
            divisions,
            genders,
            // status,
            registrationStart,
            registrationEnd,
            votingStart,
            votingEnd,
            // result: {},
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

        // Call blockchainAddElection after saving to MongoDB
        const blockchainElectionID = savedElection._id.toString(); // Use MongoDB election ID
        const blockchainTitle = savedElection.title;

        try {
            const blockchainReceipt = await blockchainAddElection(blockchainElectionID, blockchainTitle);
            console.log('Election added to blockchain:', blockchainReceipt);
        } catch (blockchainError) {
            console.error('Error adding election to blockchain:', blockchainError);
            return res.status(500).json({ message: 'Election created but failed to add to blockchain' });
        }



        // Respond with the newly created election
        res.status(201).json(savedElection);
    } catch (error) {
        // Handle errors
        console.error('Error creating election:', error);
        res.status(500).json({ message: error.message });
    }
}

async function adminUpdateElection(req, res) {
    try {
        // Check if the request is from an admin
        if (!req.body.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { id } = req.params;

        // Fetch the current version of the election by ID from the database
        const election = await Elections.findById(id);

        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }


        const { user, isAdmin, ...updates } = req.body;

        const newRegistrationStart = new Date(updates.registrationStart);
        const newRegistrationEnd = new Date(updates.registrationEnd);
        const newVotingStart = new Date(updates.votingStart)
        const newVotingEnd = new Date(updates.votingEnd)


        const today = new Date();

        // newRegistrationStart.setHours(0, 0, 0, 0);
        // newRegistrationEnd.setHours(0, 0, 0, 0);
        // newVotingStart.setHours(0, 0, 0, 0);
        // newVotingEnd.setHours(0, 0, 0, 0);


        today.setHours(0, 0, 0, 0);

        if (newRegistrationStart <= today && today < newRegistrationEnd) {
            election.status = 'Registration';
        }
        else if (newRegistrationEnd < today) {
            if (newVotingStart <= today && today < newVotingEnd) {
                election.status = 'Ongoing';
            }
            else if (newVotingEnd < today) {
                election.status = 'Finished';
                // election.result = calculateResult(election);
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
        election.courses = updates.courses || election.courses;
        election.divisions = updates.divisions || election.divisions;
        election.genders = updates.genders || election.genders;

        // Save the updated election
        await election.save();

        // Get the current election title from the blockchain
        // const blockchainTitle = await blockchainGetElectionTitle(id);

        // Check if the title has changed and update the blockchain
        // if (updates.title && updates.title !== blockchainTitle) {
        //     const changeTitleResult = await blockchainChangeElectionTitle(id, updates.title);
        //     if (!changeTitleResult.success) {
        //         console.error('Error updating title on blockchain:', changeTitleResult.message);
        //         return res.status(500).json({ message: changeTitleResult.message });
        //     }
        // }

        let toggleStatusResult;
        try {
            const blockchainElectionStatus = !(election.status == 'Pending' || election.status == 'Finished')

            console.log("called to change status on blockchain to ", blockchainElectionStatus);

            toggleStatusResult = await blockchainToggleElectionStatus(id, blockchainElectionStatus);
        } catch (error) {

            console.error('Error changing election status on blockchain:', toggleStatusResult.message);
            return res.status(500).json({ message: toggleStatusResult.message });
        }
        res.status(200).json({ message: "Election updated successfully", election });
    } catch (error) {
        console.error("Error updating election:", error);
        res.status(500).json({ message: error.message });
    }
}

async function voterUpdateElection(req, res) {

    //console.log("****************\n\nReg to voterUpdateElection with action: ", req.body.action);
    //console.log("****************\n\nReq data candidates: ", req.body.candidates);

    try {
        if (req.body.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const { action } = req.body;

        // Fetch the election by ID
        const election = await Elections.findById(id + "");
        //console.log("\nElection: ", election);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        if (election.status == 'Finished') {
            return res.status(400).json({ message: 'Election has finished' })
        }

        // Ensure the user's course and division are eligible for this election
        const userCourse = req.body.user.course;
        const userDivision = req.body.user.division;
        if (!election.courses.includes(userCourse) || !election.divisions.includes(userDivision)) {
            return res.status(403).json({ message: "You are not eligible to participate in this election" });
        }

        // Perform the action based on the request body
        switch (action) {
            case 'register':
                console.log("register code ran");
                if (election.status !== 'Registration') {
                    return res.status(400).json({ message: 'Registration is not ongoing' })
                }

                if (!election.genders.includes(req.body.user.gender)) {
                    return res.status(400).json({ message: 'Valid genders for candidates: ' + election.genders })
                }

                // Register the user as a candidate for the election
                if (election.candidates.some(candidate => candidate.candidateID.equals(req.body.user._id))) {
                    return res.status(400).json({ message: "You are already registered as a candidate for this election" });
                }
                election.candidates.push({ candidateID: req.body.user._id, noOfVotesReceived: 0 });

                // Adding the candidate to the blockchain
                try {
                    const blockchainResult = await blockchainAddCandidate(election._id.toString(), req.body.user._id.toString());
                    console.log('Candidate successfully added to the blockchain:', blockchainResult);
                } catch (blockchainError) {
                    console.error('Failed to add candidate to the blockchain:', blockchainError.message);
                }

                break;

            case 'withdraw':
                if (election.status !== 'Registration') {
                    return res.status(400).json({ message: 'Registration/Withdrawal period has finished' })
                }
                // Deregister the user as a candidate from the election
                const index = election.candidates.findIndex(candidate => candidate.candidateID.equals(req.body.user._id));
                if (index === -1) {
                    return res.status(400).json({ message: "You are not registered as a candidate for this election" });
                }
                election.candidates.splice(index, 1);

                // Remove the candidate from the blockchain
                try {
                    const blockchainResult = await blockchainRemoveCandidate(election._id.toString(), req.body.user._id.toString());
                    console.log('Candidate successfully removed from the blockchain:', blockchainResult);
                } catch (blockchainError) {
                    console.error('Failed to remove candidate from the blockchain:', blockchainError.message);
                    return res.status(500).json({ message: blockchainError.message });
                }

                break;

            case 'vote':

                if (election.status !== 'Ongoing') {
                    return res.status(400).json({ message: "Voting is not ongoing for this election" });
                }

                const alreadyVoted = election.votersWhoHaveVoted.some(voter => voter.voterID.equals(req.body.user._id));
                if (alreadyVoted) {
                    return res.status(400).json({ message: "You have already voted in this election" });
                }

                if (req.body.candidates.checkedValues.length > election.numberOfWinners) {
                    return res.status(400).json({ message: "You cannot vote for more than " + election.numberOfWinners + " candidates" })
                }

                for (const cd of req.body.candidates.checkedValues) {
                    const candidateIndex = election.candidates.findIndex(candidate => candidate.candidateID.equals(cd));
                    console.log("result of query:", candidateIndex);
                    if (candidateIndex === -1) {
                        return res.status(400).json({ message: "Candidate not found" });
                    }

                    // Update the number of votes received by the candidate
                    election.candidates[candidateIndex].noOfVotesReceived++;

                    // Cast the vote on the blockchain
                    try {
                        console.log("Recached voting place in blockchain")
                        const blockchainResult = await blockchainVote(election._id.toString(), cd.toString(), req.body.user._id.toString());
                        console.log('Vote successfully recorded on blockchain:', blockchainResult);
                    } catch (blockchainError) {
                        console.error('Failed to cast vote on the blockchain:', blockchainError.message);
                    }
                }
                // Add the user to the list of voters who have voted in the election
                election.votersWhoHaveVoted.push({ voterID: req.body.user._id });



                break;

            default:
                return res.status(400).json({ message: "Invalid action" });
        }

        // Save the updated election
        await election.save();

        res.status(200).json({ message: action + " performed successfully" });

    } catch (error) {
        console.error("Error updating election:", error);
        res.status(500).json({ message: error.message });
    }
}

export { getAllElections, getElectionByID, createElection, adminUpdateElection, voterUpdateElection }