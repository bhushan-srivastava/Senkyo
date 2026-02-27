import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Box, Stack, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { clearAccessToken, getAccessToken } from "../auth/token";

const RegisterAndWithdrawCandidate = ({ election, user }) => {
  const [isCandidate, setIsCandidate] = useState(false);

  useEffect(() => {
    if (election && election.candidates && user) {
      setIsCandidate(election.candidates.some((candidate) => candidate._id === user._id));
    }
  }, [election, user]);

  const handleRegistration = () => {
    const token = getAccessToken();
    fetch(`/api/elections/${election._id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        action: isCandidate ? "withdraw" : "register",
      })
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            clearAccessToken();
          }
          throw new Error(data?.message || `Request failed with status ${response.status}`);
        }
        message.success(data?.message);
        setIsCandidate(!isCandidate);
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{
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
