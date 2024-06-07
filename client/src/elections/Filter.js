import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Chip, Checkbox, ListItemText, Stack, } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';


const ElectionFilterDialog = ({ open, handleClose }) => {
    const [filterCriteria, setFilterCriteria] = useState({
        courses: [],
        divisions: [],
        statusArr: []
    });

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
        // If it's an array (like courses and divisions), use spread operator
        // If it's a single value (like statusArr), directly set the value
        setFilterCriteria(prevState => ({
            ...prevState,
            [name]: Array.isArray(value) ? value : [value] // Ensure value is always an array
        }));
    };


    const handleApplyFilter = () => {
        // Implement filter logic here
        console.log("Filter Criteria:", filterCriteria);
        handleClose();
    };

    const courses = [
        "FY MCA", "SY MCA",
        "FY CMPN", "SY CMPN", "TY CMPN", "BE CMPN",
        "FY INFT", "SY INFT", "TY INFT", "BE INFT"
    ]

    const divisions = ['A', 'B']

    const statusArr = ['Pending', 'Registration', 'Ongoing', 'Finished']

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
            <DialogTitle>Filter Elections</DialogTitle>

            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                    <FormControl sx={{ m: 1, }}>
                        <InputLabel id="course-select">Course</InputLabel>
                        <Select
                            value={filterCriteria.courses}
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
                                    <Checkbox checked={filterCriteria.courses.indexOf(course) > -1} />
                                    <ListItemText primary={course} />
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, }}>
                        <InputLabel id="division-select">Division</InputLabel>
                        <Select
                            value={filterCriteria.divisions}
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
                                <MenuItem key={index} value={division}> <Checkbox checked={filterCriteria.divisions.indexOf(division) > -1} />
                                    <ListItemText primary={division} />
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, }}>
                        <InputLabel id="status-select">Status</InputLabel>
                        <Select
                            labelId='status-select'
                            multiple
                            value={filterCriteria.statusArr}
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
                                <MenuItem key={index} value={status}> <Checkbox checked={filterCriteria.statusArr.indexOf(status) > -1} />
                                    <ListItemText primary={status} />
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                </Box>
            </DialogContent>
            <DialogActions sx={{ mr: 3, mb: 1.5 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleApplyFilter} variant='contained'>Apply Filter</Button>
            </DialogActions>
        </Dialog>
    );
};

const Filter = () => {
    const [open, setOpen] = useState(false);

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
            <ElectionFilterDialog open={open} handleClose={handleClose} />
        </div>
    );
};

export default Filter;
