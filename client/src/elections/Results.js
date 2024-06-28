import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent } from '@mui/joy';
import { Box, Typography } from '@mui/material';
import Avatar from '@mui/joy/Avatar';
import { isEmpty } from "./electionHelper";
import CandidateCard from './CandidateCard';

const Results = ({ election }) => {


    console.log("election in results:", election);

    if (isEmpty(election)) {
        return "Election not found"
    }

    const pieChartData = election.candidates.map((candidate) => {
        return {
            value: candidate.noOfVotesReceived,
            label: candidate.name,
        }
    });


    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" mt={2}>Result</Typography>
            <PieChart
                series={[
                    {
                        data: pieChartData,
                        valueFormatter: (v, { dataIndex }) => {
                            // const { rank } = 
                            return `recieved ${v.value} votes and is ranked #${dataIndex + 1}.`;
                        },
                    },
                ]}

                width={300}
                height={200}
            />

            <Typography variant="h5" mt={2}>Winners</Typography>
            <div style={{
                display: 'flex', flexWrap: 'wrap',
                // justifyContent: 'center' 
                marginTop: '10px',
                // marginBottom: '10px'
            }}>
                {election.candidates.slice(0, election.noOfWinners).map((candidate, index) => (
                    <CandidateCard key={"winner-card-" + index} candidate={candidate} isWinner={true} />
                ))}
            </div>
        </Box>
    );
}

export default Results;
