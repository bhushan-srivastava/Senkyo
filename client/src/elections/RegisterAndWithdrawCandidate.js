import React, { useEffect, useState } from "react";
import { message } from "antd";
import Cookies from "js-cookie";
import { Box, Stack, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';

const RegisterAndWithdrawCandidate = ({ election }) => {
  const [candidates, setCandidates] = useState([]);
  const [isCandidate, setIsCandidate] = useState(false);

  const user = Cookies.get("name");
  // const user = document.cookie.

  useEffect(() => {
    if (election && election.candidates) {
      setCandidates(election.candidates);

      for (let index = 0; index < election.candidates.length; index++) {
        //console.log("in the loop with:", election.candidates[index].name);
        if (election.candidates[index].name === user) {
          setIsCandidate(true);
        }
      }

      //creating a backend api to check for registration instead of using cookie name
    }
  }, [election, candidates]);

  const handleRegistration = () => {
    fetch(`/api/elections/${election._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: isCandidate ? "withdraw" : "register",
      })
    })
      .then(async response => {
        // Ensure the response is successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        }
        return response.json();
      })
      .then((data) => {

        message.success(data.message);
        setIsCandidate(!isCandidate);
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{
      // border: "2px solid grey",
      padding: 2,
    }}>

      {election.status == "Pending" && (
        <Typography>Registration Hasn't started yet</Typography>
      )}
      {isCandidate ?
        <Stack direction='row' gap={1} alignItems='center'>
          Want to withdraw as a candidate from this election?

          <IconButton onClick={handleRegistration} color="secondary" sx={{ borderRadius: '6px', fontSize: 'small' }} size="small"
          >

            WITHDRAW <PersonRemoveOutlinedIcon />

          </IconButton>
        </Stack>
        :
        <Stack direction='row' gap={1} alignItems='center'>
          Want to become a candidate in this election?
          <IconButton color="secondary" onClick={handleRegistration} sx={{ borderRadius: '6px', fontSize: 'small', }} size="small">
            REGISTER <PersonAddAltOutlinedIcon />
          </IconButton>
        </Stack>
      }

    </Box>
  );
};

export default RegisterAndWithdrawCandidate;
