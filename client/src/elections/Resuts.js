import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent } from '@mui/joy';
import { Typography } from '@mui/material';
import Avatar from '@mui/joy/Avatar';
import { isEmpty } from "./electionHelper";

const WinnerCard = ({ winner }) => {
    return (
        <div className="winner-card">
            <Card
                variant="soft"
                orientation="horizontal"
            // sx={{ width: 320, }}
            >
                <Avatar
                    // component="img"
                    // height="140"
                    src={winner.imgCode}
                    alt={winner.name}
                    // size='lg'
                    sx={{ height: '80px', width: '80px' }}
                />

                <CardContent sx={{ rowGap: 0 }}>
                    <Typography variant="h6" fontWeight='normal'>
                        {winner.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {winner.email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Has received: {winner.noOfVotesReceived} votes
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};


const Results = ({ election }) => {



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
        <>
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
                    <WinnerCard key={"winner-card-" + index} winner={candidate} />
                ))}
            </div>
        </>
    );
}

export default Results;
