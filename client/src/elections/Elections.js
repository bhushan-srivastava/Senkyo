import Typography from '@mui/joy/Typography/Typography';
import Grid from '@mui/joy/Grid';
import { useEffect, useMemo, useState } from 'react';
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
import { Paper, Stack, Button, Pagination, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Filter, { defaultFilterState } from './Filter';
import { message } from "antd";
import ElectionInfoList from './ElectionInfoList';
import { clearAccessToken, getAccessToken } from "../auth/token";

function toCsv(items) {
    return Array.isArray(items) && items.length ? items.join(",") : "";
}

const Elections = () => {
    const { isAdmin } = useOutletContext();
    const [elections, setElections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageMeta, setPageMeta] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 9,
    });
    const [queryState, setQueryState] = useState({
        page: 1,
        limit: 9,
        sortBy: "registrationStart",
        sortOrder: "desc",
        filters: { ...defaultFilterState },
    });

    const hasActiveFilters = useMemo(() => {
        const f = queryState.filters;
        return (
            f.courses.length > 0 ||
            f.divisions.length > 0 ||
            f.statusArr.length > 0 ||
            Boolean(f.registrationStart) ||
            Boolean(f.registrationEnd) ||
            Boolean(f.votingStart) ||
            Boolean(f.votingEnd)
        );
    }, [queryState.filters]);

    useEffect(() => {
        const fetchElections = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                params.set("page", String(queryState.page));
                params.set("limit", String(queryState.limit));
                params.set("sortBy", queryState.sortBy);
                params.set("sortOrder", queryState.sortOrder);

                const { filters } = queryState;
                const statusCsv = toCsv(filters.statusArr);
                const courseCsv = toCsv(filters.courses);
                const divisionCsv = toCsv(filters.divisions);
                if (statusCsv) params.set("statuses", statusCsv);
                if (courseCsv) params.set("courses", courseCsv);
                if (divisionCsv) params.set("divisions", divisionCsv);
                if (filters.registrationStart) params.set("registrationStart", filters.registrationStart);
                if (filters.registrationEnd) params.set("registrationEnd", filters.registrationEnd);
                if (filters.votingStart) params.set("votingStart", filters.votingStart);
                if (filters.votingEnd) params.set("votingEnd", filters.votingEnd);

                const token = getAccessToken();
                const response = await fetch(`/api/elections?${params.toString()}`, {
                    method: "GET",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        clearAccessToken();
                    }
                    throw new Error(data?.message || `Request failed with status ${response.status}`);
                }

                setElections(data?.elections || []);
                setPageMeta({
                    currentPage: data?.currentPage || 1,
                    totalPages: data?.totalPages || 1,
                    totalItems: data?.totalItems || 0,
                    pageSize: data?.pageSize || queryState.limit,
                });
            } catch (error) {
                message.error('Error fetching elections: ' + error.message);
                setElections([]);
                setPageMeta({ currentPage: 1, totalPages: 1, totalItems: 0, pageSize: queryState.limit });
            } finally {
                setIsLoading(false);
            }
        };

        fetchElections();
    }, [queryState]);

    const handleApplyFilters = (newFilters) => {
        setQueryState((prev) => ({
            ...prev,
            page: 1,
            filters: newFilters,
        }));
    };

    const handleClearFilters = () => {
        setQueryState((prev) => ({
            ...prev,
            page: 1,
            filters: { ...defaultFilterState },
        }));
    };

    const handleSortByChange = (event) => {
        setQueryState((prev) => ({
            ...prev,
            page: 1,
            sortBy: event.target.value,
        }));
    };

    const handleSortOrderChange = (event) => {
        setQueryState((prev) => ({
            ...prev,
            page: 1,
            sortOrder: event.target.value,
        }));
    };

    const handlePageSizeChange = (event) => {
        setQueryState((prev) => ({
            ...prev,
            page: 1,
            limit: event.target.value,
        }));
    };

    const handlePageChange = (_, newPage) => {
        setQueryState((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    return (
        <Paper variant='outlined' sx={{ marginLeft: "30px", marginRight: "35px", border: 'none', mt: 0, display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
            <Stack gap={2} display='flex' flexDirection='row' alignItems='flex-end' flexWrap='wrap' justifyContent='center'>
                <Typography level="h4" sx={{ marginLeft: "5px", marginBottom: "2vh" }}>
                    {isAdmin && "Admin: "}Elections
                </Typography>

                <Filter value={queryState.filters} onApply={handleApplyFilters} />

                <FormControl size="small" sx={{  mb: "2vh", mt:"2vh" }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={queryState.sortBy} label="Sort By" onChange={handleSortByChange}>
                        <MenuItem value="registrationStart">Registration Start</MenuItem>
                        <MenuItem value="votingStart">Voting Start</MenuItem>
                        <MenuItem value="createdAt">Created At</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ mb: "2vh", mt:"2vh" }}>
                    <InputLabel>Order</InputLabel>
                    <Select value={queryState.sortOrder} label="Order" onChange={handleSortOrderChange}>
                        <MenuItem value="desc">Desc</MenuItem>
                        <MenuItem value="asc">Asc</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ mb: "2vh", mt:"2vh" }}>
                    <InputLabel>Page Size</InputLabel>
                    <Select value={queryState.limit} label="Page Size" onChange={handlePageSizeChange}>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={18}>18</MenuItem>
                    </Select>
                </FormControl>

                {hasActiveFilters && (
                    <Button variant="outlined" onClick={handleClearFilters} sx={{ borderRadius: "6px", height: '40px', marginBottom: "2vh" }}>
                        Clear Filters
                    </Button>
                )}
            </Stack>

            <Typography level="body-sm" sx={{ mb: 1 }}>
                {isLoading ? "Loading..." : `Showing ${elections.length} of ${pageMeta.totalItems} elections`}
            </Typography>

            {!isLoading && elections.length === 0 ? (
                <Typography level="h4" sx={{ margin: "20px", color: 'red' }}>
                    No record with this criteria found
                </Typography>
            ) : (
                <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                    {elections.map((election) => (
                        <Grid key={election._id} display="flex" justifyContent="flex-start" alignItems="center" minHeight={180}>
                            <Card variant="outlined" sx={{ width: 320, maxWidth: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <AvatarGroup size='lg'>
                                            {(election.candidatesImages || []).map((candidateImage, index) => (
                                                <Avatar key={`${election._id}-candidate-${index}`} src={candidateImage} variant="outlined" />
                                            ))}
                                            <Avatar>...</Avatar>
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
                                        {isAdmin && (
                                            <IconButton href={`/elections/${election._id}/edit`} variant='solid' sx={{ borderRadius: "6px", color: 'InfoText', fontSize: 'small' }}>
                                                Edit
                                                <ModeEditOutlinedIcon color='fff' />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Pagination
                page={pageMeta.currentPage}
                count={pageMeta.totalPages}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 1, mb: 2 }}
            />

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

