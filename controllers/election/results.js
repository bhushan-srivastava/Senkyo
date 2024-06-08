function calculateResult(election) {
    const candidates = election.candidates;
    const numberOfWinners = election.numberOfWinners;

    // Sort candidates by number of votes received in descending order
    candidates.sort((a, b) => b.noOfVotesReceived - a.noOfVotesReceived);


    // Format the winners' data for the frontend
    const candidatesData = candidates.map(candidate => ({
        name: candidate.candidateID.name,
        email: candidate.candidateID.email,
        imgCode: candidate.candidateID.imgCode,
        votesReceived: candidate.noOfVotesReceived
    }));



    // Calculate total votes received by each candidate
    const totalVotesByCandidate = candidates.reduce((result, candidate) => {
        result[candidate.candidateID.name] = candidate.noOfVotesReceived;
        return result;
    }, {});



    // Return the results data
    return {
        winners: winnersData,
        totalVotesByCandidate: totalVotesByCandidate
    };
}


export default calculateResult 