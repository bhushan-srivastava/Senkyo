import { Button, IconButton, Stack } from "@mui/material";
import { message } from "antd";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';

const RegisterAndWithdrawCandidate = ({ electionID, isAdmin }) => {

    const handleClick = async (action) => {
        try {
            console.log(action.toLowerCase());
            if (isAdmin) {
                message.error("Admin cannot " + action + " as a Candidate");
                return
            }

            const response = await fetch(`/api/elections/${electionID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'action': action.toLowerCase() })
            });

            const responseData = await response.json();

            if (response.status == 200) {
                message.success(responseData.message);
            }
            else {
                message.error(action + ' unsuccessful ' + responseData.message, 10);
            }

        } catch (error) {
            // message.error(action + ' unsuccessful ' + responseData.message, 10);
            console.log(error.message);
        }
    }


    return (
        <Stack direction='row' gap={2} flexWrap='wrap' justifyContent='center'>
            <IconButton variant="contained" color="secondary" onClick={() => { handleClick('Register') }} sx={{ borderRadius: '6px', fontSize: 'small' }} size="small">
                <PersonAddAltOutlinedIcon />
                BECOME A CANDIDATE
            </IconButton>
            <IconButton onClick={() => { handleClick('Withdraw') }} color="secondary" sx={{ borderRadius: '6px', fontSize: 'small' }} size="small"
            >

                <PersonRemoveOutlinedIcon />
                WITHDRAW AS A CANDIDATE

            </IconButton>
        </Stack>
    );
}

export default RegisterAndWithdrawCandidate;