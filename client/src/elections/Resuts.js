import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(CategoryScale, ArcElement, LinearScale,);

const WinnerCard = ({ winner }) => {
    return (
        <div className="winner-card">
            <Card>
                <CardMedia
                    component="img"
                    height="140"
                    image={`https://example.com/${winner.imgCode}.jpg`}
                    alt={winner.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {winner.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Email: {winner.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Votes Received: {winner.noOfVotesReceived}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};


const Results = ({ /*candidates*/ }) => {
    // Dummy data for candidates
    const candidates = [
        { name: "Candidate 1", email: "candidate1@example.com", imgCode: "img1", noOfVotesReceived: 100 },
        { name: "Candidate 2", email: "candidate2@example.com", imgCode: "img2", noOfVotesReceived: 150 },
        { name: "Candidate 3", email: "candidate3@example.com", imgCode: "img3", noOfVotesReceived: 200 },
    ];

    const pieChartData = {
        labels: candidates.map(candidate => candidate.name),
        datasets: [{
            data: candidates.map(candidate => candidate.noOfVotesReceived),
            // backgroundColor: [
            //     'rgba(255, 99, 132, 0.6)',
            //     'rgba(54, 162, 235, 0.6)',
            //     'rgba(255, 206, 86, 0.6)',
            //     // Add more colors if you have more candidates
            // ],
        }],
    };


    return (
        <>
            <Pie data={pieChartData} />

            winners
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {candidates.map(candidate => (
                    <WinnerCard key={candidate.name} winner={candidate} />
                ))}
            </div>
        </>
    );
}

export default Results;
