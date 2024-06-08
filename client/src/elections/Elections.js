import Typography from '@mui/joy/Typography/Typography';
import Grid from '@mui/joy/Grid';
import { useEffect, useState } from 'react';
import axios from "axios";


import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/joy/AvatarGroup';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DoneIcon from '@mui/icons-material/Done';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';

import { useOutletContext } from "react-router-dom"
import { Pagination, Paper, Stack } from '@mui/material';
import FilterSort from './Filter';
const Elections = () => {
    const { isAdmin } = useOutletContext();
    const [elections, setElections] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const electionsPerPage = 4; // Number of elections to display per page

    const dummyElections = [
        {
            title: "Student Council",
            numberOfWinners: 5,
            courses: ["FY MCA", "SY MCA", "FY CMPN"],
            divisions: ["A", "B"],
            status: "Pending",
            registrationStart: new Date("2024-06-01"),
            registrationEnd: new Date("2024-06-05"),
            votingStart: new Date("2024-06-07"),
            votingEnd: new Date("2024-06-10"),

            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Class Representative",
            numberOfWinners: 2,
            courses: ["SY CMPN", "BE CMPN"],
            divisions: ["A"],
            status: "Registration",
            registrationStart: new Date("2024-05-20"),
            registrationEnd: new Date("2024-05-25"),
            votingStart: new Date("2024-05-27"),
            votingEnd: new Date("2024-06-01"),

            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Department Head",
            numberOfWinners: 1,
            courses: ["TY INFT", "BE INFT"],
            divisions: ["B"],
            status: "Ongoing",
            registrationStart: new Date("2024-05-15"),
            registrationEnd: new Date("2024-05-20"),
            votingStart: new Date("2024-05-22"),
            votingEnd: new Date("2024-05-25"),

            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Club Committee",
            numberOfWinners: 3,
            courses: ["FY INFT", "TY INFT"],
            divisions: ["A", "B"],
            status: "Finished",
            registrationStart: new Date("2024-05-10"),
            registrationEnd: new Date("2024-05-15"),
            votingStart: new Date("2024-05-17"),
            votingEnd: new Date("2024-05-20"),

            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Inter-Department Sports Meet Elections",
            numberOfWinners: 3,
            courses: ["FY CMPN", "FY INFT"],
            divisions: ["A"],
            registrationStart: new Date("2024-07-01"),
            registrationEnd: new Date("2024-07-05"),
            votingStart: new Date("2024-07-07"),
            votingEnd: new Date("2024-07-10"),

            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Club Committee",
            numberOfWinners: 3,
            courses: ["FY INFT", "TY INFT"],
            divisions: ["A", "B"],
            status: "Finished",
            registrationStart: new Date("2024-05-10"),
            registrationEnd: new Date("2024-05-15"),
            votingStart: new Date("2024-05-17"),
            votingEnd: new Date("2024-05-20"),

            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Department Head",
            numberOfWinners: 1,
            courses: ["TY INFT", "BE INFT"],
            divisions: ["B"],
            status: "Ongoing",
            registrationStart: new Date("2024-05-15"),
            registrationEnd: new Date("2024-05-20"),
            votingStart: new Date("2024-05-22"),
            votingEnd: new Date("2024-05-25"),

            candidates: [],
            votersWhoHaveVoted: []
        },
    ];

    useEffect(() => {
        axios.get(`/api/elections?page=${currentPage}&limit=${electionsPerPage}`)
            .then(response => {
                setElections(response.data);
            })
            .catch(error => {
                console.error('Error fetching elections:', error);
            });
        // setElections(dummyElections)
    }, [currentPage, electionsPerPage]);

    // Get current elections
    const indexOfLastElection = currentPage * electionsPerPage;
    const indexOfFirstElection = indexOfLastElection - electionsPerPage;
    const currentElections = elections.slice(indexOfFirstElection, indexOfLastElection);

    // Change page
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const statusIcons = {
        Pending: () => <PendingOutlinedIcon />,
        // Registration: () => <HowToRegIcon />,
        Registration: () => <PersonAddAltOutlinedIcon />,
        Ongoing: () => <HowToVoteIcon />,
        Finished: () => <DoneIcon />,
        // Finished: () => <EmojiEventsOutlinedIcon />
    }



    return (
        <Paper
            variant='outlined'
            sx={{ marginLeft: "30px", marginRight: "35px", border: 'none' }}
        >
            <br />
            <Typography level="h4" sx={{ marginLeft: "5px", marginBottom: "2vh", }}>
                {isAdmin && "Admin: "}Elections
            </Typography>
            <Stack
                // direction='row'
                gap={2}
                display='flex'
                flexDirection='row'
                alignItems='baseline'
            >

                <FilterSort elections={currentElections} />


                {/* Pagination */}
                <Pagination
                    count={Math.ceil(elections.length / electionsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    // variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    color='standard'
                />
            </Stack>

            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                sx={{ mb: 2.5 }}
            // sx={{ marginLeft: "30px", marginRight: "35px" }}
            >
                {currentElections.map((election, index) => (
                    <Grid
                        key={index}
                        xs={12}
                        sm={6}
                        md={3}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        minHeight={180}
                    >

                        <Card
                            variant="outlined"
                            sx={{
                                width: 320,
                                maxWidth: '100%',
                                // borderColor: 'Background'
                                // to make the card resizable
                                //overflow: 'auto',
                                //resize: 'horizontal',
                                // '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                            }}
                        >
                            <CardContent>
                                {/* <Box
                                sx={{
                                    // display: 'flex',

                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            > */}
                                {/* <IconButton> */}


                                {/* <OpenInNewIcon /> */}
                                {/* </IconButton> */}

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* candiates faces as avatars */}
                                    <AvatarGroup size='lg' >
                                        <Avatar src="/static/images/avatar/2.jpg" />
                                        <Avatar src="/static/images/avatar/3.jpg" />
                                        <Avatar>···</Avatar>
                                        {/* <Avatar>...</Avatar> */}
                                    </AvatarGroup>


                                    <Typography marginTop='20px' marginBottom='8px' level="h4">{election.title}
                                    </Typography>



                                </Box>

                                <List>
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
                                            <Groups3OutlinedIcon />
                                        </ListItemDecorator>
                                        <ListItemContent>
                                            <Typography level="title-sm">Candidate's Geimport Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
                                                nders</Typography>
                                            <Typography level="body-sm">
                                                {election.genders.map((gender, index) => {
                                                    if (index < election.genders.length - 1) return (gender += ',');
                                                    return gender;
                                                })
                                                }
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
                                                {election.registrationStart.toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: '2-digit'
                                                }) + ' - ' + election.registrationEnd.toLocaleDateString('en-GB', {
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
                                                {election.votingStart.toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: '2-digit'
                                                }) + ' - ' + election.votingEnd.toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: '2-digit'
                                                })}
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


                            </CardContent>

                            <CardActions sx={{ mt: -2, alignItems: "center", display: 'flex', flexDirection: 'column' }} >
                                <IconButton
                                    href='/elections/:electionID'
                                    variant='solid'
                                    sx={{ borderRadius: "6px", color: 'InfoText' }}

                                >

                                    <ReadMoreIcon color='fff' />

                                </IconButton>

                                {isAdmin && <IconButton
                                    href='/elections/:electionID/edit'
                                    variant='solid'
                                    sx={{ borderRadius: "6px", color: 'InfoText' }}

                                >
                                    <ModeEditOutlinedIcon color='fff' />

                                </IconButton>}
                            </CardActions>

                        </Card>
                    </Grid>


                ))
                }
            </Grid >

            {
                isAdmin
                &&
                <Zoom
                    // key={fab.color}
                    in={true}
                    // timeout={transitionDuration}

                    unmountOnExit
                >
                    <Fab
                        color='primary'
                        sx={{ borderRadius: '10px', position: "fixed", bottom: '20px', right: '20px' }}
                        borderRadius='6px'
                        href='/elections/create'
                    >
                        {/* ab */}
                        <AddIcon />
                    </Fab>
                </Zoom>
            }


        </Paper >
    );
}

export default Elections;