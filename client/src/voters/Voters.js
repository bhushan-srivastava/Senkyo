import Typography from "@mui/joy/Typography/Typography";
import { DataGrid, GridDeleteIcon, GridToolbar } from "@mui/x-data-grid";
// import Box from '@mui/joy/Box';
import Avatar from "@mui/joy/Avatar";
import Modal from "@mui/joy/Modal"
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';

import IconButton from "@mui/joy/IconButton";

import {
    Paper,
    Box,
    Button,
    Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useOutletContext } from 'react-router-dom';
import { Image, message } from "antd"

const Voters = () => {
    const { isAdmin } = useOutletContext();

    const [voterRows, setVoterRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        description: "",
        action: null,
    });

    //styles for modal component
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        // border: "2px solid #000",
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

    //getting users
    useEffect(() => {
        if (isAdmin) {
            axios
                .get("/api/voters/")
                .then((res) => {
                    setVoterRows(res.data);
                    console.log("data from server:", res);
                })
                .catch((err) => console.log("Error in useEffect :", err));
        }
    }, []);

    function isEqual(originalRow, updatedRow) {
        // Check if number of properties are different
        if (Object.keys(originalRow).length !== Object.keys(updatedRow).length) {
            return false;
        }

        // Compare each property value
        for (const key in originalRow) {
            if (originalRow[key] !== updatedRow[key]) {
                return false;
            }
        }

        return true; // Rows are identical
    }

    //setting the row that has changed in an array
    const handleProcessRowUpdate = async (updatedRow, originalRow) => {
        if (isEqual(originalRow, updatedRow)) {
            return originalRow
        }
        // setShowModal(true);
        // setModalContent({
        //     title: "Confirm changes",
        //     description: "The data would be changed permanently in the database",
        //     action: () => handleSaveChanges(updatedRow),
        // });



        if (isAdmin) {
            console.log("Values changed for a row:", updatedRow);
            const { _id, ...updatedData } = updatedRow;

            const response = await fetch('/api/voters/' + _id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })

            if (response.status == 200) {
                const responseData = await response.json()
                message.success("Changes saved for " + responseData.name)
                return responseData
            }
            else {
                const responseData = await response.json()
                message.error("Unable to save changes " + responseData.message, 10)
                return originalRow
            }
        }

        // setShowModal(false);
    };

    // handling deletion request
    const handleDeleteRow = (id) => {
        setShowModal(true);
        setModalContent({
            title: "Confirm deletion",
            description: "Are you sure you want to delete this row?",
            action: () => confirmDeleteRow(id),
        });
    };

    // deleting row after confirmation from modal
    const confirmDeleteRow = (id) => {
        if (isAdmin) {
            axios
                .delete(`/api/voters/${id}`)
                .then((res) => {
                    setVoterRows(voterRows.filter((row) => row._id !== id));
                    console.log("Data deleted:", res);
                    setShowModal(false);
                })
                .catch((err) => {
                    console.log("Error deleting data:", err);
                    setShowModal(false);
                });
        }
        else {
            setShowModal(false)
        }
    };

    const handleProcessRowUpdateError = (error) => {
        console.log(error);
    };

    //handling modal function call
    const handleModalAction = () => {
        if (modalContent.action) {
            modalContent.action();
        }
        // else {
        //     setShowModal(false);
        // }
    };


    const columns = [
        {
            field: "imgCode",
            headerName: "Photo",
            width: 75,
            filterable: false,
            sortable: false,
            renderCell: (params) =>

                <Image width={48} height={48} src={params.value}
                    style={{ borderRadius: "100px" }} />
            ,
            //  const buffer = Buffer.from(imageBuffer, 'binary').toString('base64');
            // // setImageSrc(`data:image/jpeg;base64,${buffer}`);
            // renderCell: (params) => <Avatar src={`data:image/jpeg;base64,${buffer}`} size='lg' />,
        },
        {
            field: "name",
            headerName: "Name",
            width: 200,
            editable: true,
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
            editable: true,
        },
        {
            field: "course",
            headerName: "Course",
            width: 150,
            editable: true,
            type: "singleSelect",
            valueOptions: [
                "FY MCA", "SY MCA",
                "FY CMPN", "SY CMPN", "TY CMPN", "BE CMPN",
                "FY INFT", "SY INFT", "TY INFT", "BE INFT"
            ],
        },
        {
            field: "division",
            headerName: "Division",
            width: 100,
            editable: true,
            type: "singleSelect",
            valueOptions: ['A', 'B'],
        },
        {
            field: "gender",
            headerName: "Gender",
            width: 100,
            editable: true,
            type: "singleSelect",
            valueOptions: ['Male', 'Female'],
        },
        {
            field: "verified",
            headerName: "Verified",
            width: 150,
            editable: true,
            type: "boolean",
            // type: "singleSelect",
            // valueOptions: ["Yes", "No"]
        },
        {
            field: "actions",
            headerName: "",
            filterable: false,
            sortable: false,
            type: "actions",
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => handleDeleteRow(params.row._id)}
                        variant="plain"
                    >
                        <GridDeleteIcon />
                    </IconButton>
                );
            },
        },
    ];

    return (
        !isAdmin ?
            <Navigate to="/" />
            :
            <Box sx={{ marginLeft: "30px", marginRight: "10px" }}>

                <Modal open={showModal} onClose={() => setShowModal(false)}>

                    <ModalDialog>
                        <DialogTitle>{modalContent.title}</DialogTitle>

                        <DialogContent>{modalContent.description}</DialogContent>

                        <Stack spacing={2} direction="row" sx={{ m: "5px" }}>
                            <Button onClick={handleModalAction}>Confirm</Button>
                            <Button onClick={() => setShowModal(false)}>Cancel</Button>
                        </Stack>
                    </ModalDialog>

                </Modal>

                <Paper variant="outlined" sx={{ border: 'none', marginRight: '3vw' }}>
                    <br />
                    <Typography level="h4" sx={{ marginLeft: "5px", marginBottom: "2vh", textAlign: 'center' }}>
                        Admin: Voters Panel
                    </Typography>

                    <DataGrid
                        sx={{
                            // border: "none",
                            // marginLeft: "2vw",
                        }}

                        rows={voterRows}
                        columns={columns}
                        // density="comfortable"
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        slots={{ toolbar: GridToolbar }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        // disableRowSelectionOnClick
                        editMode="row" /** not sure */
                        getRowId={(row) => row._id}
                        onProcessRowUpdateError={handleProcessRowUpdateError}
                        processRowUpdate={handleProcessRowUpdate}
                    />
                </Paper>
            </Box>
    );
};

export default Voters;
