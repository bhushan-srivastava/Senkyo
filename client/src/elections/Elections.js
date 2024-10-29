import Typography from '@mui/joy/Typography/Typography';
import Grid from '@mui/joy/Grid';
import { useEffect, useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/joy/AvatarGroup';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import { useOutletContext } from "react-router-dom";
import { Paper, Stack, Button } from '@mui/material';
import Filter from './Filter';
import { message } from "antd";
import ElectionInfoList from './ElectionInfoList';

const Elections = () => {
    const { isAdmin } = useOutletContext();
    const [elections, setElections] = useState([]);
    const [filteredElections, setFilteredElections] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        courses: [],
        divisions: [],
        statusArr: [],
        registrationStart: null,
        registrationEnd: null,
        votingStart: null,
        votingEnd: null
    });

    useEffect(() => {
        fetch('/api/elections')  // Removed pagination query parameters
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch elections');
                }
                return response.json();
            })
            .then(data => {
                setElections(data);
                setFilteredElections(data);
            })
            .catch(error => {
                message.error('Error fetching elections: ' + error.message);
            });
    }, []);

    useEffect(() => {
        const filtered = elections.filter(election => {
            const matchesCourses = filterCriteria.courses.length === 0 || filterCriteria.courses.includes(election.courses[0]);
            const matchesDivisions = filterCriteria.divisions.length === 0 || filterCriteria.divisions.includes(election.divisions[0]);
            const matchesStatus = filterCriteria.statusArr.length === 0 || filterCriteria.statusArr.includes(election.status);
            const matchesRegistrationDates = (!filterCriteria.registrationStart || new Date(election.registrationStart) >= new Date(filterCriteria.registrationStart)) &&
                (!filterCriteria.registrationEnd || new Date(election.registrationEnd) <= new Date(filterCriteria.registrationEnd));
            const matchesVotingDates = (!filterCriteria.votingStart || new Date(election.votingStart) >= new Date(filterCriteria.votingStart)) &&
                (!filterCriteria.votingEnd || new Date(election.votingEnd) <= new Date(filterCriteria.votingEnd));

            return matchesCourses && matchesDivisions && matchesStatus && matchesRegistrationDates && matchesVotingDates;
        });

        setFilteredElections(filtered);
    }, [filterCriteria, elections]);

    const handleClearFilters = () => {
        setFilterCriteria({
            courses: [],
            divisions: [],
            statusArr: [],
            registrationStart: null,
            registrationEnd: null,
            votingStart: null,
            votingEnd: null
        });

        const resetFilterEvent = new CustomEvent('resetFilters');
        window.dispatchEvent(resetFilterEvent);
    };

    return (
        <Paper variant='outlined' sx={{ marginLeft: "30px", marginRight: "35px", border: 'none', mt: 0, display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
            <Stack gap={2} display='flex' flexDirection='row' alignItems='flex-end'>
                <Typography level="h4" sx={{ marginLeft: "5px", marginBottom: "2vh" }}>
                    {isAdmin && "Admin: "}Elections
                </Typography>
                <Filter setFilterCriteria={setFilterCriteria} />
                {filterCriteria.courses.length > 0 || filterCriteria.divisions.length > 0 || filterCriteria.statusArr.length > 0 ? (
                    <Button variant="outlined" onClick={handleClearFilters} sx={{ borderRadius: "6px", height: '35px', marginBottom: "2vh" }}>
                        Clear Filters
                    </Button>
                ) : null}
            </Stack>

            {filteredElections.length === 0 ? (
                <Typography level="h4" sx={{ margin: "20px", color: 'red' }}>
                    No record with this criteria found
                </Typography>
            ) : (
                <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                    {filteredElections.map((election, index) => (
                        <Grid key={index} display="flex" justifyContent="flex-start" alignItems="center" minHeight={180}>
                            <Card variant="outlined" sx={{ width: 320, maxWidth: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <AvatarGroup size='lg'>
                                            {election.candidatesImages.map((candidateImage, index) => <Avatar key={index} src={candidateImage} variant="outlined" />)}
                                            <Avatar>···</Avatar>
                                        </AvatarGroup>
                                        <Typography marginTop='20px' marginBottom='8px' level="h4">{election.title}</Typography>
                                    </Box>
                                    <ElectionInfoList election={election} flexDirection='column' />
                                </CardContent>
                                <CardActions sx={{ mt: -2, alignItems: "center", display: 'flex', flexDirection: 'column' }}>
                                    <Stack direction='row' gap='2'>
                                        <IconButton href={`/elections/${election._id}`} variant='solid' sx={{ borderRadius: "6px", color: 'InfoText', mr: 2, fontSize: 'small' }}>
                                            Open
                                            <ReadMoreIcon color='fff' />
                                        </IconButton>
                                        {isAdmin && <IconButton href={`/elections/${election._id}/edit`} variant='solid' sx={{ borderRadius: "6px", color: 'InfoText', fontSize: 'small' }}>
                                            Edit
                                            <ModeEditOutlinedIcon color='fff' />
                                        </IconButton>}
                                    </Stack>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {isAdmin && (
                <Zoom in={true} unmountOnExit>
                    <Fab color='primary' sx={{ borderRadius: '10px', position: "fixed", bottom: '20px', right: '20px' }} borderRadius='6px' href='/elections/create'>
                        <AddIcon />
                    </Fab>
                </Zoom>
            )}
        </Paper>
    );
}

export default Elections;
