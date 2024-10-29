import React, { useState, useEffect } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Chip, Checkbox, ListItemText, Stack, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const ElectionFilterDialog = ({ open, handleClose, setFilterCriteria, filterState, setFilterState }) => {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilterState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleApplyFilter = () => {
        setFilterCriteria(filterState);
        handleClose();
    };

    const courses = [
        "FY MCA", "SY MCA",
        "FY CMPN", "SY CMPN", "TY CMPN", "BE CMPN",
        "FY INFT", "SY INFT", "TY INFT", "BE INFT"
    ];

    const divisions = ['A', 'B'];
    const statusArr = ['Pending', 'Registration', 'Ongoing', 'Finished'];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
            <DialogTitle>Filter Elections</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                    <FormControl sx={{ m: 1 }}>
                        <InputLabel id="course-select">Courses</InputLabel>
                        <Select
                            value={filterState.courses}
                            labelId='course-select'
                            multiple
                            onChange={handleChange}
                            name="courses"
                            input={<OutlinedInput label='Courses' />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected?.map((value) => (
                                        <Chip key={value} label={value} sx={{ borderRadius: '6px' }} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {courses.map((course, index) =>
                                <MenuItem key={index} value={course}>
                                    <Checkbox checked={filterState.courses.indexOf(course) > -1} />
                                    <ListItemText primary={course} />
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1 }}>
                        <InputLabel id="division-select">Divisions</InputLabel>
                        <Select
                            value={filterState.divisions}
                            labelId='division-select'
                            multiple
                            onChange={handleChange}
                            name="divisions"
                            input={<OutlinedInput label='Division' />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected?.map((value) => (
                                        <Chip key={value} label={value} sx={{ borderRadius: '6px' }} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {divisions.map((division, index) =>
                                <MenuItem key={index} value={division}>
                                    <Checkbox checked={filterState.divisions.indexOf(division) > -1} />
                                    <ListItemText primary={division} />
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1 }}>
                        <InputLabel id="status-select">Status</InputLabel>
                        <Select
                            labelId='status-select'
                            multiple
                            value={filterState.statusArr}
                            onChange={handleChange}
                            name="statusArr"
                            input={<OutlinedInput label='Status' />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected?.map((value) => (
                                        <Chip key={value} label={value} sx={{ borderRadius: '6px' }} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {statusArr.map((status, index) =>
                                <MenuItem key={index} value={status}>
                                    <Checkbox checked={filterState.statusArr.indexOf(status) > -1} />
                                    <ListItemText primary={status} />
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <Stack spacing={2} sx={{ m: 1 }}>
                        <TextField
                            label="Registration Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setFilterState({ ...filterState, registrationStart: e.target.value })}
                        />
                        <TextField
                            label="Registration End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setFilterState({ ...filterState, registrationEnd: e.target.value })}
                        />
                        <TextField
                            label="Voting Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setFilterState({ ...filterState, votingStart: e.target.value })}
                        />
                        <TextField
                            label="Voting End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setFilterState({ ...filterState, votingEnd: e.target.value })}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions sx={{ mr: 3, mb: 1.5 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleApplyFilter} variant='contained'>Apply Filter</Button>
            </DialogActions>
        </Dialog>
    );
};

const Filter = ({ setFilterCriteria }) => {
    const [open, setOpen] = useState(false);
    const [filterState, setFilterState] = useState({
        courses: [],
        divisions: [],
        statusArr: [],
        registrationStart: null,
        registrationEnd: null,
        votingStart: null,
        votingEnd: null
    });

    useEffect(() => {
        const handleResetFilters = () => {
            setFilterState({
                courses: [],
                divisions: [],
                statusArr: [],
                registrationStart: null,
                registrationEnd: null,
                votingStart: null,
                votingEnd: null
            });
        };

        window.addEventListener('resetFilters', handleResetFilters);

        return () => {
            window.removeEventListener('resetFilters', handleResetFilters);
        };
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <IconButton onClick={handleClickOpen} sx={{ borderRadius: "6px", color: 'InfoText' }}>
                <FilterListIcon />
            </IconButton>
            <ElectionFilterDialog
                open={open}
                handleClose={handleClose}
                setFilterCriteria={setFilterCriteria}
                filterState={filterState}
                setFilterState={setFilterState}
            />
        </div>
    );
};

export default Filter;
