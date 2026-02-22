import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import { Typography } from '@mui/material';

// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DoneIcon from '@mui/icons-material/Done';

const ElectionInfoList = ({ election, flexDirection }) => {

    const statusIcons = {
        Pending: () => <PendingOutlinedIcon />,
        // Registration: () => <HowToRegIcon />,
        Registration: () => <PersonAddAltOutlinedIcon />,
        Ongoing: () => <HowToVoteIcon />,
        Finished: () => <DoneIcon />,
        // Finished: () => <EmojiEventsOutlinedIcon />
    }

    return (

        <List sx={{
            flexDirection: flexDirection,
            flexWrap: 'wrap', justifyContent: 'center',

            p: 4
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
                    <Groups3OutlinedIcon />
                </ListItemDecorator>
                <ListItemContent>
                    <Typography level="title-sm">Courses</Typography>
                    <Typography level="body-sm">
                        {election.courses.map((course, index) => {
                            if (index < election.courses.length - 1) return (course += ', ');
                            return course;
                        })
                        }
                    </Typography>
                </ListItemContent>
            </ListItem>

            <ListItem>
                <ListItemDecorator>
                    <Groups3OutlinedIcon />
                </ListItemDecorator>
                <ListItemContent>
                    <Typography level="title-sm">Divisions</Typography>
                    <Typography level="body-sm">
                        {election.divisions.map((division, index) => {
                            if (index < election.divisions.length - 1) return (division += ', ');
                            return division;
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
    );
}

export default ElectionInfoList;
