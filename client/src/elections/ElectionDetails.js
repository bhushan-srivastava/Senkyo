import { Paper } from "@mui/material";
import Typography from '@mui/joy/Typography';
import { useOutletContext } from "react-router-dom"
import Voting from "./Voting";

const ElectionDetails = () => {
    const { isAdmin } = useOutletContext();
    const electionDetails = {}//fetcj from the DB using electionID
    // if admin then display a datagrid of candiates with 'accepted?' column
    // else if voter then display the voting module
    return (
        <Paper variant="outlined" sx={{ borderColor: 'Background' }}>
            <br />
            <Typography level='h3' sx={{ marginLeft: '2vw' }}>
                Election Name
            </Typography>

            <p>
                Election Description
            </p>


            {isAdmin ? "datagrid" : <Voting electionDetails={electionDetails} />}
        </Paper >
    );
}

export default ElectionDetails;