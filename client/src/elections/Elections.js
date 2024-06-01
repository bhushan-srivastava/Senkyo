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

import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DoneIcon from '@mui/icons-material/Done';

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';

import { useOutletContext } from "react-router-dom"
import { Paper } from '@mui/material';
import FilterSort from './Filter';
const Elections = () => {
    const { isAdmin } = useOutletContext();
    const [elections, setElections] = useState([]);
    const dummyElections = [
        {
            title: "Student Council",
            description: "Elections for selecting student council members",
            numberOfWinners: 5,
            course: ["FY MCA", "SY MCA", "FY CMPN"],
            division: ["A", "B"],
            status: "Pending",
            registrationStart: new Date("2024-06-01"),
            registrationEnd: new Date("2024-06-05"),
            votingStart: new Date("2024-06-07"),
            votingEnd: new Date("2024-06-10"),
            resultDeclared: false,
            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Class Representative",
            description: "Elections for selecting class representatives",
            numberOfWinners: 2,
            course: ["SY CMPN", "BE CMPN"],
            division: ["A"],
            status: "Registration",
            registrationStart: new Date("2024-05-20"),
            registrationEnd: new Date("2024-05-25"),
            votingStart: new Date("2024-05-27"),
            votingEnd: new Date("2024-06-01"),
            resultDeclared: false,
            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Department Head",
            description: "Elections for selecting department heads",
            numberOfWinners: 1,
            course: ["TY INFT", "BE INFT"],
            division: ["B"],
            status: "Ongoing",
            registrationStart: new Date("2024-05-15"),
            registrationEnd: new Date("2024-05-20"),
            votingStart: new Date("2024-05-22"),
            votingEnd: new Date("2024-05-25"),
            resultDeclared: false,
            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Club Committee",
            description: "Elections for selecting club committee members",
            numberOfWinners: 3,
            course: ["FY INFT", "TY INFT"],
            division: ["A", "B"],
            status: "Finished",
            registrationStart: new Date("2024-05-10"),
            registrationEnd: new Date("2024-05-15"),
            votingStart: new Date("2024-05-17"),
            votingEnd: new Date("2024-05-20"),
            resultDeclared: true,
            candidates: [],
            votersWhoHaveVoted: []
        },
        {
            title: "Inter-Department Sports Meet Elections",
            description: "Elections for organizing the inter-department sports meet",
            numberOfWinners: 3,
            course: ["FY CMPN", "FY INFT"],
            division: ["A"],
            status: "Paused",
            registrationStart: new Date("2024-07-01"),
            registrationEnd: new Date("2024-07-05"),
            votingStart: new Date("2024-07-07"),
            votingEnd: new Date("2024-07-10"),
            resultDeclared: false,
            candidates: [],
            votersWhoHaveVoted: []
        },
    ];
    useEffect(() => {
        setElections(dummyElections)
        // axios
        //     .get("/api/elections/")
        //     .then((res) => {
        //         setElections(res.data);
        //         console.log("data from server:", res);
        //     })
        //     .catch((err) => console.log("Error in useEffect :", err));

    }, []); // Empty dependency array to fetch data only once on component mount

    // setElections([{ title: 'abc' }])

    const statusIcons = {
        Pending: () => <PendingOutlinedIcon />,
        Registration: () => <HowToRegIcon />,
        Ongoing: () => <HowToVoteIcon />,
        Paused: () => <PauseIcon />,
        Finished: () => <DoneIcon />
    }


    const status = 'Pending' // Dummy value

    return (
        <Paper
            variant='outlined'
            sx={{ marginLeft: "30px", marginRight: "35px", border: 'none' }}
        >
            <br />
            <Typography level="h4" sx={{ marginLeft: "5px", marginBottom: "2vh", }}>
                {isAdmin && "Admin: "}Elections
            </Typography>
            <FilterSort elections={elections} />
            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
            // sx={{ marginLeft: "30px", marginRight: "35px" }}
            >
                {elections.map((election, index) => (
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
                                        <Avatar src="/static/images/avatar/4.jpg" />
                                        <Avatar>···</Avatar>
                                        {/* <Avatar>...</Avatar> */}
                                    </AvatarGroup>


                                    <Typography marginTop='20px' marginBottom='8px' level="h4">{election.title}
                                    </Typography>


                                    {/* </Box> */}
                                    {/* <Typography level="body-md" sx={{ color: 'CaptionText' }}>
                                        Election description
                                    </Typography> */}
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

                                    <ListItem>
                                        <ListItemDecorator>
                                            <EventIcon />
                                        </ListItemDecorator>
                                        <ListItemContent>
                                            <Typography level="title-sm">Result Declared?</Typography>
                                            <Typography level="body-sm">
                                                {election.resultDeclared ? 'Yes' : 'No'}
                                            </Typography>
                                        </ListItemContent>
                                    </ListItem>
                                </List>

                                {/* <Typography level="body-md" sx={{ color: 'CaptionText' }}>
                                    Election description
                                </Typography> */}

                            </CardContent>

                            <CardActions sx={{ mt: -2, alignItems: "center", display: 'flex', flexDirection: 'column' }} >
                                <IconButton
                                    href='/elections/:electionID'
                                    variant='solid'
                                    sx={{ borderRadius: "6px", color: 'InfoText' }}

                                >
                                    {
                                        isAdmin ?
                                            <ModeEditOutlinedIcon color='fff' />
                                            :
                                            <ReadMoreIcon color='fff' />
                                    }
                                </IconButton>
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
                        href='/elections/:electionID'
                    >
                        {/* ab */}
                        <AddIcon />
                    </Fab>
                </Zoom>
            }
        </Paper>
    );
}

export default Elections;