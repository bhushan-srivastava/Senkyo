import Elections from "../../models/election/election.model.js"

function toDate(value) {
    return new Date(value);
}

function parseCsv(raw) {
    if (!raw || typeof raw !== "string") return [];
    return raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function parsePositiveInt(raw, fallback, maxValue = Number.MAX_SAFE_INTEGER) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed < 1) return fallback;
    return Math.min(parsed, maxValue);
}

function getElectionStatus({ registrationStart, registrationEnd, votingStart, votingEnd }, today) {
    if (registrationStart <= today && today < registrationEnd) {
        return "Registration";
    }
    if (registrationEnd < today && votingStart <= today && today < votingEnd) {
        return "Ongoing";
    }
    if (votingEnd < today) {
        return "Finished";
    }
    return "Pending";
}

async function getAllElections(req, res) {
    try {
        const dbQuery = {};
        const andFilters = [];

        // Check if the request is from a voter
        if (!req.auth.isAdmin) {
            andFilters.push({ courses: { $in: [req.auth.user.course] } });
            andFilters.push({ divisions: { $in: [req.auth.user.division] } });
        }

        // Additional filtering based on query parameters
        const statusFilter = parseCsv(req.query.statuses || req.query.status);
        if (statusFilter.length > 0) {
            dbQuery.status = { $in: statusFilter };
        }

        const coursesFilter = parseCsv(req.query.courses);
        const divisionsFilter = parseCsv(req.query.divisions);
        if (coursesFilter.length > 0) {
            andFilters.push({ courses: { $in: coursesFilter } });
        }
        if (divisionsFilter.length > 0) {
            andFilters.push({ divisions: { $in: divisionsFilter } });
        }

        if (req.query.genders) {
            const gendersFilter = parseCsv(req.query.genders);
            if (gendersFilter.length > 0) {
                andFilters.push({ genders: { $in: gendersFilter } });
            }
        }

        // Filter by registration dates
        if (req.query.registrationStart) {
            andFilters.push({ registrationStart: { $gte: toDate(req.query.registrationStart) } });
        }
        if (req.query.registrationEnd) {
            andFilters.push({ registrationEnd: { $lte: toDate(req.query.registrationEnd) } });
        }

        // Filter by voting dates
        if (req.query.votingStart) {
            andFilters.push({ votingStart: { $gte: toDate(req.query.votingStart) } });
        }
        if (req.query.votingEnd) {
            andFilters.push({ votingEnd: { $lte: toDate(req.query.votingEnd) } });
        }

        if (andFilters.length > 0) {
            dbQuery.$and = andFilters;
        }

        // Pagination logic
        const requestedPage = parsePositiveInt(req.query.page, 1);
        const limit = parsePositiveInt(req.query.limit, 9, 50);

        const sortableFields = new Set(["registrationStart", "votingStart", "createdAt", "title", "status"]);
        const sortBy = sortableFields.has(req.query.sortBy) ? req.query.sortBy : "registrationStart";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const sort = { [sortBy]: sortOrder, _id: -1 };

        // Get total documents for pagination
        const totalElections = await Elections.countDocuments(dbQuery);
        const totalPages = totalElections === 0 ? 1 : Math.ceil(totalElections / limit);
        const currentPage = Math.min(requestedPage, totalPages);
        const skip = (currentPage - 1) * limit;

        // Query elections from the database with pagination
        const elections = await Elections.find(dbQuery)
            .select('-description -votersWhoHaveVoted') // Exclude the description field
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'candidates.candidateID',
                model: 'users',
                select: 'imgCode'
            })
            .lean(); // Convert Mongoose documents to plain JavaScript objects

        // Process the candidates' images and remove the full candidates array
        elections.forEach(election => {
            election.candidatesImages = election.candidates
                .slice(0, 2)
                .map(candidate => candidate.candidateID?.imgCode)
                .filter(Boolean);
            delete election.candidates; // Remove the candidates field
        });

        res.status(200).json({
            elections,
            totalItems: totalElections,
            totalPages,
            currentPage,
            pageSize: limit,
            sortBy,
            sortOrder: sortOrder === 1 ? "asc" : "desc",
            hasPrevPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
        });
    } catch (error) {
        console.error('Error fetching elections:', error);
        res.status(500).json({ error: error.message });
    }
}


async function getElectionByID(req, res) {
    try {

        const { id } = req.params;

        // Find the election by ID and populate the candidates' data
        const election = await Elections.findById(id)
            .select('-__v -createdAt -updatedAt')
            .populate({
                path: 'candidates.candidateID',
                model: 'users',
                select: 'name email course division gender imgCode'
            })
            .lean(); // Use .lean() for a plain JS object and better performance

        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        // check if the voter is allowed to access the requested election
        if (!req.auth.isAdmin) {
            if (!election.courses.includes(req.auth.user.course) || !election.divisions.includes(req.auth.user.division)) {
                return res.status(403).json({ message: "You are not allowed to access this election" });
            }
        }

        const formattedCandidates = election.candidates.map((candidate) => {
            // The user data is now populated in candidate.candidateID
            const candidateData = {
                ...candidate.candidateID, // Spread the populated user details
                _id: candidate.candidateID._id, // Ensure _id is correct
            };

            if (election.status === 'Finished') {
                candidateData.noOfVotesReceived = candidate.noOfVotesReceived;
            }

            return candidateData;
        });

        // Sort by votes received (descending) if the election is finished
        if (election.status === 'Finished') {
            formattedCandidates.sort((a, b) => (b.noOfVotesReceived || 0) - (a.noOfVotesReceived || 0));
        }

        const formattedVoters = election.votersWhoHaveVoted.map(voter => voter.voterID);

        const formattedElection = {
            ...election,
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

        if (!req.auth.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Extract data from request body
        let { title, description, numberOfWinners, courses, divisions, genders, registrationStart, registrationEnd, votingStart, votingEnd } = req.body;

        registrationStart = toDate(registrationStart);
        registrationEnd = toDate(registrationEnd);
        votingStart = toDate(votingStart);
        votingEnd = toDate(votingEnd);
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
            registrationStart,
            registrationEnd,
            votingStart,
            votingEnd,
            candidates: [],
            votersWhoHaveVoted: []
        });

        newElection.status = getElectionStatus(
            { registrationStart, registrationEnd, votingStart, votingEnd },
            today
        );


        // Save the new election to the database
        const savedElection = await newElection.save();

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
        if (!req.auth.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { id } = req.params;

        // Fetch the current version of the election by ID from the database
        const election = await Elections.findById(id);

        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }


        const updates = req.body;

        const newRegistrationStart = toDate(updates.registrationStart);
        const newRegistrationEnd = toDate(updates.registrationEnd);
        const newVotingStart = toDate(updates.votingStart)
        const newVotingEnd = toDate(updates.votingEnd)

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        election.status = getElectionStatus(
            {
                registrationStart: newRegistrationStart,
                registrationEnd: newRegistrationEnd,
                votingStart: newVotingStart,
                votingEnd: newVotingEnd
            },
            today
        );

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

        res.status(200).json({ message: "Election updated successfully", election });
    } catch (error) {
        console.error("Error updating election:", error);
        res.status(500).json({ message: error.message });
    }
}

async function voterUpdateElection(req, res) {
    try {
        if (req.auth.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const { action } = req.body;

        // Fetch the election by ID
        const election = await Elections.findById(id + "");
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        if (election.status === 'Finished') {
            return res.status(400).json({ message: 'Election has finished' })
        }

        // Ensure the user's course and division are eligible for this election
        const userCourse = req.auth.user.course;
        const userDivision = req.auth.user.division;
        if (!election.courses.includes(userCourse) || !election.divisions.includes(userDivision)) {
            return res.status(403).json({ message: "You are not eligible to participate in this election" });
        }

        // Perform the action based on the request body
        switch (action) {
            case 'register':
                if (election.status !== 'Registration') {
                    return res.status(400).json({ message: 'Registration is not ongoing' })
                }

                if (!election.genders.includes(req.auth.user.gender)) {
                    return res.status(400).json({ message: 'Valid genders for candidates: ' + election.genders })
                }

                // Register the user as a candidate for the election
                if (election.candidates.some(candidate => candidate.candidateID.equals(req.auth.user._id))) {
                    return res.status(400).json({ message: "You are already registered as a candidate for this election" });
                }
                election.candidates.push({ candidateID: req.auth.user._id, noOfVotesReceived: 0 });

                

                break;

            case 'withdraw':
                if (election.status !== 'Registration') {
                    return res.status(400).json({ message: 'Registration/Withdrawal period has finished' })
                }
                // Deregister the user as a candidate from the election
                const index = election.candidates.findIndex(candidate => candidate.candidateID.equals(req.auth.user._id));
                if (index === -1) {
                    return res.status(400).json({ message: "You are not registered as a candidate for this election" });
                }
                election.candidates.splice(index, 1);


                break;

            case 'vote':

                if (election.status !== 'Ongoing') {
                    return res.status(400).json({ message: "Voting is not ongoing for this election" });
                }

                const alreadyVoted = election.votersWhoHaveVoted.some(voter => voter.voterID.equals(req.auth.user._id));
                if (alreadyVoted) {
                    return res.status(400).json({ message: "You have already voted in this election" });
                }

                const checkedValues = req.body?.candidates?.checkedValues;
                if (!Array.isArray(checkedValues) || checkedValues.length === 0) {
                    return res.status(400).json({ message: "At least one candidate must be selected" });
                }

                // Security fix: duplicate candidate IDs in one ballot could inflate vote counts.
                // We require each candidate to appear only once in a single vote request.
                const uniqueCheckedValues = [...new Set(checkedValues.map((id) => id.toString()))];
                if (uniqueCheckedValues.length !== checkedValues.length) {
                    return res.status(400).json({ message: "Duplicate candidate selections are not allowed" });
                }

                if (uniqueCheckedValues.length > election.numberOfWinners) {
                    return res.status(400).json({ message: "You cannot vote for more than " + election.numberOfWinners + " candidates" })
                }

                for (const cd of uniqueCheckedValues) {
                    const candidateIndex = election.candidates.findIndex(candidate => candidate.candidateID.equals(cd));
                    if (candidateIndex === -1) {
                        return res.status(400).json({ message: "Candidate not found" });
                    }

                    // Update the number of votes received by the candidate
                    election.candidates[candidateIndex].noOfVotesReceived++;
                }
                // Add the user to the list of voters who have voted in the election
                election.votersWhoHaveVoted.push({ voterID: req.auth.user._id });
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




