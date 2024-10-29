// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectionManager {
    struct Candidate {
        string candidateID; // MongoDB ObjectId as string
        int32 voteCount; // Number of votes received
    }

    struct Voter {
        bool voted; // Whether the voter has voted
        string votedForCandidate; // Candidate ID for the vote // redundant incase we want anonymous voting
    }

    struct Election {
        string title;
        mapping(string => Candidate) candidates; // Candidate ID as key
        string[] candidateIDs; // Store candidate IDs for easy iteration
        mapping(string => Voter) voters; // Voter ID (MongoDB ObjectId) as key
        uint candidatesCount;
        bool active;
    }

    address public admin;
    mapping(string => Election) public elections; // Election ID as key
    string[] public electionIDs; // Store election IDs for easy iteration
    uint public electionsCount;

    constructor() {
        admin = msg.sender;
        electionsCount = 0;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Admin creates a new election
    function addElection(
        string memory _electionID,
        string memory _title
    ) public onlyAdmin {
        require(
            bytes(elections[_electionID].title).length == 0,
            "Election already exists"
        );
        elections[_electionID].title = _title;
        elections[_electionID].candidatesCount = 0;
        elections[_electionID].active = true;
        electionIDs.push(_electionID);
        electionsCount++;
    }

    // Admin adds candidates to a specific election
    function addCandidate(
        string memory _electionID,
        string memory _candidateID,
        int32 noOfVotes
    ) public {
        require(elections[_electionID].active, "Election is not active");
        require(
            bytes(elections[_electionID].candidates[_candidateID].candidateID)
                .length == 0,
            "Candidate already exists"
        );

        elections[_electionID].candidates[_candidateID] = Candidate(
            _candidateID,
            noOfVotes
        );
        elections[_electionID].candidateIDs.push(_candidateID);
        elections[_electionID].candidatesCount++;
    }

    // Function to cast votes (called by backend)
    function vote(
        string memory _electionID,
        string memory _candidateID,
        string memory voterID
    ) public {
        require(elections[_electionID].active, "Election is not active");
        require(
            !elections[_electionID].voters[voterID].voted,
            "Voter has already voted"
        );

        elections[_electionID].voters[voterID].voted = true;
        elections[_electionID].voters[voterID].votedForCandidate = _candidateID; // redundant

        elections[_electionID].candidates[_candidateID].voteCount++;
    }

    // Get candidate details for a specific election
    function getCandidate(
        string memory _electionID,
        string memory _candidateID
    ) public view returns (string memory candidateID, int32 voteCount) {
        candidateID = elections[_electionID]
            .candidates[_candidateID]
            .candidateID;
        voteCount = elections[_electionID].candidates[_candidateID].voteCount;
    }

    // Get election title
    function getElectionTitle(
        string memory _electionID
    ) public view returns (string memory) {
        return elections[_electionID].title;
    }

    // Retrieve all elections with their data
    function getAllElections()
        public
        view
        returns (string[] memory titles, bool[] memory activeStatuses)
    {
        titles = new string[](electionsCount);
        activeStatuses = new bool[](electionsCount);

        for (uint i = 0; i < electionIDs.length; i++) {
            titles[i] = elections[electionIDs[i]].title;
            activeStatuses[i] = elections[electionIDs[i]].active;
        }
        return (titles, activeStatuses);
    }

    // Get all candidates and their vote count from a particular election
    function getAllCandidates(
        string memory _electionID
    )
        public
        view
        returns (string[] memory candidateIDs, int32[] memory voteCounts)
    {
        uint count = elections[_electionID].candidatesCount;
        candidateIDs = new string[](count);
        voteCounts = new int32[](count);

        for (uint i = 0; i < count; i++) {
            candidateIDs[i] = elections[_electionID].candidateIDs[i];
            voteCounts[i] = elections[_electionID]
                .candidates[candidateIDs[i]]
                .voteCount;
        }
        return (candidateIDs, voteCounts);
    }

    // Remove a candidate from an election
    function removeCandidate(
        string memory _electionID,
        string memory _candidateID
    ) public {
        require(elections[_electionID].active, "Election is not active");
        require(
            bytes(elections[_electionID].candidates[_candidateID].candidateID)
                .length != 0,
            "Candidate does not exist"
        );

        delete elections[_electionID].candidates[_candidateID];
        elections[_electionID].candidatesCount--;

        // Remove from candidateIDs
        for (uint i = 0; i < elections[_electionID].candidateIDs.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(elections[_electionID].candidateIDs[i])
                ) == keccak256(abi.encodePacked(_candidateID))
            ) {
                elections[_electionID].candidateIDs[i] = elections[_electionID]
                    .candidateIDs[
                        elections[_electionID].candidateIDs.length - 1
                    ];
                elections[_electionID].candidateIDs.pop();
                break;
            }
        }
    }

    // Make an election inactive
    function toggleElectionStatus(
        string memory _electionID,
        bool status
    ) public onlyAdmin {
        elections[_electionID].active = status;
    }

    // Change title of election
    function changeElectionTitle(
        string memory _electionID,
        string memory newTitle
    ) public onlyAdmin {
        elections[_electionID].title = newTitle;
    }
}
