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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { message } from "antd";
import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from "dayjs";

const CreateEditElection = () => {
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
                        fetch(`/api/elections/${electionID}`, {
                method: "GET",
                credentials: "include",
            })
                .then(async (response) => {
                    const data = await response.json().catch(() => null);
                    if (!response.ok) {
                                                throw new Error(data?.message || `Request failed with status ${response.status}`);
                    }

                    data.registrationStart = dayjs(data.registrationStart);
                    data.registrationEnd = dayjs(data.registrationEnd);
                    data.votingStart = dayjs(data.votingStart);
                    data.votingEnd = dayjs(data.votingEnd);

                    setFormData(data);
                })
                .catch((error) => {
                    message.error(error.message);
                });
        }

    }, [isAdmin, electionID, navigate]);

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

        const payload = {
            ...formData,
            registrationStart: formData.registrationStart?.$d || formData.registrationStart,
            registrationEnd: formData.registrationEnd?.$d || formData.registrationEnd,
            votingStart: formData.votingStart?.$d || formData.votingStart,
            votingEnd: formData.votingEnd?.$d || formData.votingEnd,
        };

        if (!isAdmin) {
            message.error("Unauthorized");
            return;
        }

        try {
            let data;
            if (!electionID) {
                                const response = await fetch("/api/elections", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                data = await response.json().catch(() => null);
                if (!response.ok) {
                                        throw new Error(data?.message || `Request failed with status ${response.status}`);
                }
            }
            else {
                                const response = await fetch("/api/elections/" + electionID, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                data = await response.json().catch(() => null);
                if (!response.ok) {
                                        throw new Error(data?.message || `Request failed with status ${response.status}`);
                }
            }
            if (!electionID) {
                message.success("Election created successfully");
            } else {
                message.success((data?.election?.title || "Election") + " saved successfully");
            }
            navigate("/elections");
        } catch (error) {
            message.error(error.message, 10);
        }
    };

    return (

        isAdmin ?
            <Paper variant="outlined" sx={{ border: 'none' }}>
                <br />
                <Typography level="h4" sx={{ textAlign: 'center', mb: 2 }}>
                    {electionID ? "Edit " : "Create "}Election
                </Typography>

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






