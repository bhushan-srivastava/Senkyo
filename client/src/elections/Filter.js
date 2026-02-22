import React, { useEffect, useState } from 'react';
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    Chip,
    Checkbox,
    ListItemText,
    Stack,
    TextField,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const defaultFilterState = {
    courses: [],
    divisions: [],
    statusArr: [],
    registrationStart: null,
    registrationEnd: null,
    votingStart: null,
    votingEnd: null,
};

const ElectionFilterDialog = ({ open, handleClose, onApply, initialValue }) => {
    const [draft, setDraft] = useState(initialValue || defaultFilterState);
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

    useEffect(() => {
        if (open) {
            setDraft(initialValue || defaultFilterState);
        }
    }, [open, initialValue]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDraft((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleApplyFilter = () => {
        onApply(draft);
        handleClose();
    };

    const courses = [
        "FY MCA", "SY MCA",
        "FY CMPN", "SY CMPN", "TY CMPN", "BE CMPN",
        "FY INFT", "SY INFT", "TY INFT", "BE INFT",
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
                            value={draft.courses}
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
                            {courses.map((course) => (
                                <MenuItem key={course} value={course}>
                                    <Checkbox checked={draft.courses.indexOf(course) > -1} />
                                    <ListItemText primary={course} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1 }}>
                        <InputLabel id="division-select">Divisions</InputLabel>
                        <Select
                            value={draft.divisions}
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
                            {divisions.map((division) => (
                                <MenuItem key={division} value={division}>
                                    <Checkbox checked={draft.divisions.indexOf(division) > -1} />
                                    <ListItemText primary={division} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1 }}>
                        <InputLabel id="status-select">Status</InputLabel>
                        <Select
                            labelId='status-select'
                            multiple
                            value={draft.statusArr}
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
                            {statusArr.map((status) => (
                                <MenuItem key={status} value={status}>
                                    <Checkbox checked={draft.statusArr.indexOf(status) > -1} />
                                    <ListItemText primary={status} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Stack spacing={2} sx={{ m: 1 }}>
                        <TextField
                            label="Registration Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={draft.registrationStart || ""}
                            onChange={(e) => setDraft({ ...draft, registrationStart: e.target.value || null })}
                        />
                        <TextField
                            label="Registration End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={draft.registrationEnd || ""}
                            onChange={(e) => setDraft({ ...draft, registrationEnd: e.target.value || null })}
                        />
                        <TextField
                            label="Voting Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={draft.votingStart || ""}
                            onChange={(e) => setDraft({ ...draft, votingStart: e.target.value || null })}
                        />
                        <TextField
                            label="Voting End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={draft.votingEnd || ""}
                            onChange={(e) => setDraft({ ...draft, votingEnd: e.target.value || null })}
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

const Filter = ({ value, onApply }) => {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ marginBottom: '10px' }}>
            <IconButton onClick={() => setOpen(true)} sx={{ borderRadius: "6px", color: 'InfoText' }}>
                <FilterListIcon />
            </IconButton>
            <ElectionFilterDialog
                open={open}
                handleClose={() => setOpen(false)}
                onApply={onApply}
                initialValue={value}
            />
        </div>
    );
};

export { defaultFilterState };
export default Filter;
