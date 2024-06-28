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
import Filter from './Filter';
import { message } from "antd";
import ElectionInfoList from './ElectionInfoList';

const Elections = () => {
    const { isAdmin } = useOutletContext();
    const [elections, setElections] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const electionsPerPage = 4; // Number of elections to display per page

    useEffect(() => {
        fetch(`/api/elections?page=${currentPage}&limit=${electionsPerPage}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch elections');
                }
                return response.json();
            })
            .then(data => {
                setElections(data);
            })
            .catch(error => {
                message.error('Error fetching elections: ' + error.message);
            });
    }, [currentPage, electionsPerPage]);

    // Get current elections
    const indexOfLastElection = currentPage * electionsPerPage;
    const indexOfFirstElection = indexOfLastElection - electionsPerPage;
    const currentElections = elections.slice(indexOfFirstElection, indexOfLastElection);
    // console.log(currentElections);

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
            sx={{ marginLeft: "30px", marginRight: "35px", border: 'none', mt: 0, display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}
        >
            <br />

            <Stack
                // direction='row'
                gap={2}
                display='flex'
                flexDirection='row'
                alignItems='flex-end'
            >
                <Typography level="h4" sx={{ marginLeft: "5px", marginBottom: "2vh", }}>
                    {isAdmin && "Admin: "}Elections

                </Typography>
                <Filter elections={currentElections} />



            </Stack>

            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 1 }}
            // sx={{ marginLeft: "30px", marginRight: "35px" }}
            >
                {currentElections.map((election, index) => (
                    <Grid
                        key={index}
                        // xs={12}
                        // sm={6}
                        // md={3}
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
                                        {
                                            election.candidatesImages.map(
                                                (candidateImage, index) => <Avatar src={candidateImage} variant="outlined" />)

                                        }
                                        <Avatar>···</Avatar>
                                        {/* <Avatar>...</Avatar> */}
                                    </AvatarGroup>


                                    <Typography marginTop='20px' marginBottom='8px' level="h4">{election.title}
                                    </Typography>



                                </Box>

                                <ElectionInfoList election={election} flexDirection='column' />

                            </CardContent>

                            <CardActions sx={{ mt: -2, alignItems: "center", display: 'flex', flexDirection: 'column' }} >
                                <Stack direction='row' gap='2'>
                                    <IconButton
                                        href={`/elections/${election._id}`}
                                        variant='solid'
                                        sx={{ borderRadius: "6px", color: 'InfoText', mr: 2, fontSize: 'small' }}

                                    >
                                        Open
                                        <ReadMoreIcon color='fff' />

                                    </IconButton>

                                    {isAdmin && <IconButton
                                        href={`/elections/${election._id}/edit`}
                                        variant='solid'
                                        sx={{ borderRadius: "6px", color: 'InfoText', fontSize: 'small' }}

                                    >
                                        Edit
                                        <ModeEditOutlinedIcon color='fff' />

                                    </IconButton>}
                                </Stack>
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
                sx={{ mb: 2.5 }}
            />

        </Paper >
    );
}

export default Elections;