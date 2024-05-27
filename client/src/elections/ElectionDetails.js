import { Paper } from "@mui/material";
import Typography from '@mui/joy/Typography';

const ElectionDetails = () => {
    return (
        <Paper variant="outlined">
            <br />
            <Typography level='h3' sx={{ marginLeft: '2vw' }} color={"primary"}>
                Election Name
            </Typography>

            <p>
                Election Description
            </p>


        </Paper>
    );
}

export default ElectionDetails;