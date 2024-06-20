import { useOutletContext, useParams } from "react-router-dom";
import Results from "./Resuts";
import Voting from "./Voting";
import { useEffect, useState } from "react";
import { message } from "antd";
import { Typography, Box } from '@mui/material';
import RegisterAndWithdrawCandidate from "./RegisterAndWithdrawCandidate";



import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DoneIcon from '@mui/icons-material/Done';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';

import { isEmpty } from "./electionHelper";


const ElectionDetails = () => {
    const { isAdmin } = useOutletContext();
    const { electionID } = useParams();
    const [election, setElection] = useState({});

    useEffect(() => {
        fetch(`/api/elections/${electionID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch election');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setElection(data);
            })
            .catch(error => {
                message.error('Error fetching election: ' + error.message);
            });
    }, []);
    // }, [electionID]);


    const statusIcons = {
        Pending: () => <PendingOutlinedIcon />,
        // Registration: () => <HowToRegIcon />,
        Registration: () => <PersonAddAltOutlinedIcon />,
        Ongoing: () => <HowToVoteIcon />,
        Finished: () => <DoneIcon />,
        // Finished: () => <EmojiEventsOutlinedIcon />
    }

    return (

        <Box sx={{ p: 2, display: "flex", flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center', }}>
            {!isEmpty(election) && <Box sx={{ p: 2, display: "flex", flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="h4">{election.title}</Typography>
                <Typography variant="body1">{election.description}</Typography>
                <Box>




                    <List sx={{
                        // flexDirection: 'row',
                        flexWrap: 'wrap', justifyContent: 'center'
                    }}>
                        <ListItem>
                            <ListItemDecorator>
                                {statusIcons[election.status]()}
                            </ListItemDecorator>
                            <ListItemContent>
                                <Typography level="title-sm">Status</Typography>
                                <Typography level="body-sm">
                                    {election.status}
                                </Typography>
                            </ListItemContent>
                        </ListItem>

                        <ListItem>
                            <ListItemDecorator>
                                <CalendarMonthIcon />
                            </ListItemDecorator>
                            <ListItemContent>
                                <Typography level="title-sm">Registration Dates</Typography>
                                <Typography level="body-sm">
                                    {new Date(election.registrationStart).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    }) + ' - ' + new Date(election.registrationEnd).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    })}
                                </Typography>
                            </ListItemContent>
                        </ListItem>

                        <ListItem>
                            <ListItemDecorator>
                                <CalendarMonthIcon />
                            </ListItemDecorator>
                            <ListItemContent>
                                <Typography level="title-sm">Voting Dates</Typography>
                                <Typography level="body-sm">
                                    {new Date(election.votingStart).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    }) + ' - ' + new Date(election.votingEnd).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    })}
                                </Typography>
                            </ListItemContent>
                        </ListItem>

                        <ListItem>
                            <ListItemDecorator>
                                <Groups3OutlinedIcon />
                            </ListItemDecorator>
                            <ListItemContent>
                                <Typography level="title-sm">Candidate's Genders</Typography>
                                <Typography level="body-sm">
                                    {election.genders.map((gender, index) => {
                                        if (index < election.genders.length - 1) return (gender += ', ');
                                        return gender;
                                    })
                                    }
                                </Typography>
                            </ListItemContent>
                        </ListItem>

                        <ListItem>
                            <ListItemDecorator>
                                <EmojiEventsOutlinedIcon />
                            </ListItemDecorator>
                            <ListItemContent>
                                <Typography level="title-sm">Number of Winners</Typography>
                                <Typography level="body-sm">
                                    {election.numberOfWinners}
                                </Typography>
                            </ListItemContent>
                        </ListItem>

                    </List>
                </Box>
            </Box>
            }
            {/* only for voters */}

            {/* registration button and de register button */}
            <RegisterAndWithdrawCandidate electionID={electionID} isAdmin={isAdmin} />

            <Voting />

            {/* only if election.resultsDeclared==true */}
            <Results election={election} />

        </Box>

    );
}

export default ElectionDetails;