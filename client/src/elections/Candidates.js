import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent } from '@mui/joy';
import { Box, Typography } from '@mui/material';
import Avatar from '@mui/joy/Avatar';
import { isEmpty } from "./electionHelper";
import CandidateCard from "./CandidateCard";

const Candidates = ({ election }) => {


    console.log("election in results:", election);
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
