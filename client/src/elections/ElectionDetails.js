import { useOutletContext, useParams } from "react-router-dom";
import Results from "./Results";
import Voting from "./Voting";
import { useEffect, useState } from "react";
import { message } from "antd";
import { Typography, Box, useMediaQuery } from '@mui/material';
import RegisterAndWithdrawCandidate from "./RegisterAndWithdrawCandidate";






import { isEmpty } from "./electionHelper";
import Candidates from "./Candidates";
import ElectionInfoList from "./ElectionInfoList";
import { apiFetch } from "../api/fetchClient";


const ElectionDetails = () => {
  const { isAdmin, user } = useOutletContext();
  const { electionID } = useParams();
  const [election, setElection] = useState({});

  const isMobile = useMediaQuery('(max-width:1000px)');


  useEffect(() => {
    apiFetch(`/api/elections/${electionID}`, { method: "GET" })
      .then(({ data }) => {
        setElection(data);
      })
      .catch(error => {
        message.error('Error fetching election: ' + error.message);
      });
  }, [electionID]);




  return (

    <Box sx={{ p: 2, display: "flex", flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center', }}>
      {!isEmpty(election) && <Box sx={{ p: 2, display: "flex", flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="h4">{election.title}</Typography>
        <Typography variant="body1">{election.description}</Typography>
        <Box>



          <ElectionInfoList election={election} flexDirection={isMobile ? 'column' : 'row'} />
        </Box>
      </Box>
      }


      <Typography variant="h5" mt={2}>Candidates</Typography>
      <Candidates election={election} />

      {!isAdmin && <RegisterAndWithdrawCandidate election={election} user={user} />}
      {!isAdmin && <Voting election={election} />}


      {election.status === 'Finished' && <Results election={election} />}
    </Box>

  );
}

export default ElectionDetails;
