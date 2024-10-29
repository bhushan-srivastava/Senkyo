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

        <Box sx={{ textAlign: 'center', }}>
            <Typography variant="h5" mt={2}>
                Result
            </Typography>
            <PieChart
                series={[
                    {
                        data: pieChartData,
                        innerRadius: 10,
                        outerRadius: '80%',
                        paddingAngle: 2,
                        cornerRadius: 5,
                        startAngle: 0,
                        endAngle: 360,
                        cx: 250,
                        // cy: 150,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 15, additionalRadius: -15, color: 'gray' },
                        valueFormatter: (v, { dataIndex }) => {
                            return `${v.value} votes (Rank #${dataIndex + 1})`;
                        },
                    },
                ]}

                width={700}
                height={300}
            // slotProps={{

            // }}
            />


            <Typography variant="h5" mt={2}>Winners</Typography>
            <div style={{
                display: 'flex', flexWrap: 'wrap',
                // justifyContent: 'center' 
                marginTop: '10px',
                // marginBottom: '10px'
                justifyContent: 'space-evenly',
                paddingLeft: '5px',
                paddingRight: '5px',
            }}>
                {election.candidates.slice(0, election.numberOfWinners).map((candidate, index) => (
                    <CandidateCard key={"winner-card-" + index} candidate={candidate} isWinner={true} />
                ))}
            </div>
        </Box>
    );
}

export default Results;
