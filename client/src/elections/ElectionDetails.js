import { useOutletContext, useParams } from "react-router-dom";
import Results from "./Resuts";
import Voting from "./Voting";

const ElectionDetails = () => {
    const { isAdmin } = useOutletContext();
    const { electionID } = useParams();

    const candidates = [
        { _id: 1, name: "Candidate 1", email: "candidate1@example.com", imgCode: "img1", noOfVotesReceived: 100 },
        { _id: 2, name: "Candidate 2", email: "candidate2@example.com", imgCode: "img2", noOfVotesReceived: 150 },
        { _id: 3, name: "Candidate 3", email: "candidate3@example.com", imgCode: "img3", noOfVotesReceived: 200 },
    ];

    return (

        <>
            <Voting />
            <Results />
        </>

    );
}

export default ElectionDetails;