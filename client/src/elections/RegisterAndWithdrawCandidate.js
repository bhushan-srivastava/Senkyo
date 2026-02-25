import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Box, Stack, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { apiFetch } from "../api/fetchClient";

const RegisterAndWithdrawCandidate = ({ election, user }) => {
  const [isCandidate, setIsCandidate] = useState(false);

  useEffect(() => {
    if (election && election.candidates && user) {
      setIsCandidate(election.candidates.some((candidate) => candidate._id === user._id));
    }
  }, [election, user]);

  const handleRegistration = () => {
    apiFetch(`/api/elections/${election._id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        action: isCandidate ? "withdraw" : "register",
      })
    })
      .then(({ data }) => {
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

      {election.status === "Pending" && (
        <Typography>Registration Hasn't started yet</Typography>
      )}
      {election.status=='Registration' && isCandidate  ?
        <Stack direction='row' gap={1} alignItems='center'>
          Want to withdraw as a candidate from this election?

          <IconButton onClick={handleRegistration} color="secondary" sx={{ borderRadius: '6px', fontSize: 'small' }} size="small"
          >

            WITHDRAW <PersonRemoveOutlinedIcon />

          </IconButton>
        </Stack>
        :
        election.status=='Registration' && <Stack direction='row' gap={1} alignItems='center'>
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
