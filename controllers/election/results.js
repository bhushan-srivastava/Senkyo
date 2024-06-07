function calculateResult(election) {
    const candidates = election.candidates;
    const numberOfWinners = election.numberOfWinners;

    // Sort candidates by number of votes received in descending order
    candidates.sort((a, b) => b.noOfVotesReceived - a.noOfVotesReceived);

    // Get the top `numberOfWinners` candidates as winners
    const winners = candidates.slice(0, numberOfWinners);

    // Format the winners' data for the frontend
    const winnersData = winners.map(candidate => ({
        name: candidate.candidateID.name,
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