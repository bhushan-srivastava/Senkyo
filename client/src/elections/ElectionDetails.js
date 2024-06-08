import { useOutletContext, useParams } from "react-router-dom";

const ElectionDetails = () => {
    const { isAdmin } = useOutletContext();
    const { electionID } = useParams();
    return ("electionID: " + electionID + " details of election, voting (only if !isAdmin), result (only if election.resultDeclared==true)");
}

export default ElectionDetails;