import Typography from "@mui/joy/Typography";
import React, { useState, useEffect } from "react";

import {
    Box,
    TextField,
    Button,
    FormControl,
    Grid,
    Paper,
    Stack,
    Container,
    OutlinedInput,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { message } from "antd";
import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from "dayjs";

const CreateEditElection = () => {
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

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        numberOfWinners: 1,
        courses: [],
        divisions: [],
        genders: [],
        status: "Pending",
        registrationStart: dayjs(),
        registrationEnd: dayjs(),
        votingStart: dayjs(),
        votingEnd: dayjs()
    });

    const navigate = useNavigate();
    const { isAdmin } = useOutletContext();
    const { electionID } = useParams();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/elections');
        }
        else if (isAdmin && electionID) {
            // Fetch election data based on the electionID
            fetch(`/api/elections/${electionID}`)
                .then(response => {
                    if (response.status != 200) {
                        throw new Error('Failed to fetch election data');
                    }
                    return response.json();
                })
                .then(data => {
                    // data.registrationStart = new Date(data.registrationStart);
                    // data.registrationEnd = new Date(data.registrationEnd);
                    // data.votingStart = new Date(data.votingStart);
                    // data.votingEnd = new Date(data.votingEnd);

                    data.registrationStart = dayjs(data.registrationStart);
                    data.registrationEnd = dayjs(data.registrationEnd);
                    data.votingStart = dayjs(data.votingStart);
                    data.votingEnd = dayjs(data.votingEnd);

                    // Update state with the fetched election data
                    console.log(data);
                    setFormData(data);
                })
                .catch(error => {
                    message.error(error.message);
                });
        }

    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleDateChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        formData.registrationStart = formData.registrationStart?.$d;
        formData.registrationEnd = formData.registrationEnd?.$d;
        formData.votingStart = formData.votingStart?.$d;
        formData.votingEnd = formData.votingEnd?.$d;

        console.log(formData);
        // Submitting Election form

        if (!isAdmin) {
            throw new Error('Unauthorized')
        }

        try {
            // console.log(formData);
            let response;
            if (!electionID) {
                // create
                response = await fetch("/api/elections", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
            }
            else {
                // edit
                response = await fetch("/api/elections/" + electionID, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
            }


            const responseData = await response.json();

            //if elections was created successfully
            if (response.status === 201 || response.status === 200) {
                if (!electionID) {
                    // created
                    message.success("Election created successfully");
                } else {
                    // saved
                    message.success(responseData.election.title + " saved successfully");
                }
                navigate("/elections");
            } else {
                //Displaying error messages from backend in case of failed attempt

                message.error(responseData.message, 10);
            }
        } catch (error) {
            console.log(error);
            message.error(error.message);
        }
    };

    return (

        isAdmin ?
            <Paper variant="outlined" sx={{ border: 'none' }}>
                <br />
                <Typography level="h4" sx={{ textAlign: 'center', mb: 2 }}>
                    {electionID ? "Edit " : "Create "}Election
                </Typography>

                {/* Form */}
                <Container component="main" maxWidth="sm">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Election Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Number of Winners"
                                    name="numberOfWinners"
                                    type="number"
                                    inputProps={{ min: 1 }}
                                    value={formData.numberOfWinners}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        multiple
                                        id="select-course"
                                        options={[
                                            "FY MCA",
                                            "SY MCA",
                                            "FY CMPN",
                                            "SY CMPN",
                                            "TY CMPN",
                                            "BE CMPN",
                                            "FY INFT",
                                            "SY INFT",
                                            "TY INFT",
                                            "BE INFT",
                                        ]}
                                        value={formData.courses}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                courses: newValue,
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Courses" />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        multiple
                                        id="select-division"
                                        options={["A", "B"]}
                                        value={formData.divisions}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                divisions: newValue,
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Divisions" />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        multiple
                                        id="select-gender"
                                        options={["Male", "Female"]}
                                        value={formData.genders}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                genders: newValue,
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Candidate's Genders" />}
                                    />
                                </FormControl>
                            </Grid>
                            {electionID && <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        id="select-status"
                                        options={[
                                            "Pending",
                                            "Registration",
                                            "Ongoing",
                                            "Finished",
                                        ]}
                                        value={formData.status}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                status: newValue,
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Status" />}
                                    />
                                </FormControl>
                            </Grid>}
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={3}
                                    justifyContent='space-between'>

                                    <Box>
                                        <DatePicker
                                            label="Registration Start Date"
                                            format="DD-MM-YYYY"
                                            value={formData.registrationStart}
                                            onChange={(date) =>
                                                handleDateChange("registrationStart", date)
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth required />
                                            )}
                                        />
                                    </Box>

                                    <Box>
                                        <DatePicker
                                            label="Registration End Date"
                                            format="DD-MM-YYYY"
                                            value={formData.registrationEnd}
                                            onChange={(date) =>
                                                handleDateChange("registrationEnd", date)
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth required />
                                            )}
                                        />
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <Stack direction="row" spacing={3} justifyContent='space-between'>
                                    <Box>
                                        <DatePicker
                                            label="Voting Start Date"
                                            format="DD-MM-YYYY"
                                            value={formData.votingStart}
                                            onChange={(date) => handleDateChange("votingStart", date)}
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth required />
                                            )}
                                        />
                                    </Box>

                                    <Box>
                                        <DatePicker
                                            label="Voting End Date"
                                            format="DD-MM-YYYY"
                                            value={formData.votingEnd}
                                            onChange={(date) => handleDateChange("votingEnd", date)}
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth required />
                                            )}
                                        />
                                    </Box>
                                </Stack>
                            </Grid>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    ml: 3,
                                    height: "50px",
                                    mb: 2
                                }}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </form>
                </Container>
            </Paper>
            :
            <Navigate to='/elections' replace />
    );
};

export default CreateEditElection;
