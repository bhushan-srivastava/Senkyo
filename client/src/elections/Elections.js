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

import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';

import { useOutletContext } from "react-router-dom"
import { Paper } from '@mui/material';
const Elections = () => {
    const { isAdmin } = useOutletContext();
    const [elections, setElections] = useState([]);

    useEffect(() => {
        axios
            .get("/api/elections/")
            .then((res) => {
                setElections(res.data);
                console.log("data from server:", res);
            })
            .catch((err) => console.log("Error in useEffect :", err));

    }, []); // Empty dependency array to fetch data only once on component mount

    return (
        <Paper
            variant='outlined'
            sx={{ marginLeft: "30px", marginRight: "35px", border: 'none' }}
        >
            <br />
            <Typography level="h4" sx={{ marginLeft: "5px", marginBottom: "2vh", }}>
                {isAdmin && "Admin: "}Elections
            </Typography>

            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
            // sx={{ marginLeft: "30px", marginRight: "35px" }}
            >
                {['Jimmy', 'Michal', 'Jun', 'Marija'].map((name, index) => (
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


                                    <Typography marginTop='20px' marginBottom='8px' level="h4">Election Title
                                    </Typography>


                                    {/* </Box> */}
                                    {/* <Typography level="body-md" sx={{ color: 'CaptionText' }}>
                                        Election description
                                    </Typography> */}
                                </Box>

                                <List>
                                    <ListItem>
                                        <ListItemDecorator>
                                            <CalendarMonthIcon />
                                        </ListItemDecorator>
                                        <ListItemContent>
                                            <Typography level="title-sm">Registration Dates</Typography>
                                            <Typography level="body-sm">
                                                DD/MM/YY - DD/MM/YY
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
                                                DD/MM/YY - DD/MM/YY
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
                                                5
                                            </Typography>
                                        </ListItemContent>
                                    </ListItem>

                                    <ListItem>
                                        <ListItemDecorator>
                                            <EventIcon />
                                        </ListItemDecorator>
                                        <ListItemContent>
                                            <Typography level="title-sm">Result Declaration</Typography>
                                            <Typography level="body-sm">
                                                DD/MM/YY
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
                                            <HowToVoteOutlinedIcon color='fff' />
                                        /* <BallotOutlinedIcon color='fff' /> */
                                        /* <PollOutlinedIcon color='fff' /> */
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