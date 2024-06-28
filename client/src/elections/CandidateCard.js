import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent } from '@mui/joy';
import Avatar from '@mui/joy/Avatar';
import { Typography } from '@mui/material';
import { isEmpty } from './electionHelper';

const CandidateCard = ({ candidate, isWinner }) => {

    if (isEmpty(candidate)) {
        return "Candidate not found"
    }


    return (
        <div className="candidate-card">
            <Card
                variant="soft"
                orientation="horizontal"
                // sx={{ width: 320, }}
                sx={{ textAlign: 'left', alignItems: 'center' }}
            >
                <Avatar
                    // component="img"
                    // height="140"
                    src={candidate.imgCode}
                    alt={candidate.name}
                    // size='lg'
                    sx={{ height: '80px', width: '80px' }}
                />

                <CardContent sx={{ rowGap: 0 }}>
                    <Typography variant="h6" fontWeight='normal'>
                        {candidate.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {candidate.email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {candidate.course}/{candidate.division}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {candidate.gender}
                    </Typography>
                    {isWinner &&
                        <Typography variant="body1" color="textSecondary">
                            Has received: {candidate.noOfVotesReceived} votes
                        </Typography>}
                </CardContent>
            </Card>
        </div>
    );
}


export default CandidateCard;