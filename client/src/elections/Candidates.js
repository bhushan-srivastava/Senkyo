import React from 'react';
import { Box } from '@mui/material';
import { isEmpty } from "./electionHelper";
import CandidateCard from "./CandidateCard";

const Candidates = ({ election }) => {
    if (isEmpty(election)) {
        return "Election not found"
    }



    return (
        <Box sx={{ textAlign: 'center' }}>


            <div style={{
                display: 'flex', flexWrap: 'wrap',
                // justifyContent: 'center' 
                marginTop: '10px',
                // marginBottom: '10px'
            }}>
                {election.candidates.map((candidate, index) => (
                    <CandidateCard key={"candidate-card-" + index} candidate={candidate} isWinner={false} />
                ))}
            </div>
        </Box>
    );
}

export default Candidates;
