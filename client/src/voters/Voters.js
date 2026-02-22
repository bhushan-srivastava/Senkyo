import Typography from "@mui/joy/Typography/Typography";
import { DataGrid, GridDeleteIcon, GridToolbar } from "@mui/x-data-grid";
// import Box from '@mui/joy/Box';
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
import { Navigate, useOutletContext } from 'react-router-dom';
import { Image, message } from "antd"
import { apiFetch } from "../api/fetchClient";

const Voters = () => {
    const { isAdmin } = useOutletContext();

    const [voterRows, setVoterRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        description: "",
        action: null,
    });

    //getting users
    useEffect(() => {
        if (isAdmin) {
            apiFetch("/api/voters/", { method: "GET" })
                .then(({ data }) => {
                    setVoterRows(data);
                })
                .catch((err) => message.error(err.message || "Unable to load voters"));
        }
    }, [isAdmin]);

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
            try {
                const { _id, ...updatedData } = updatedRow;

                const { data: responseData } = await apiFetch('/api/voters/' + _id, {
                    method: 'PUT',
                    body: JSON.stringify(updatedData)
                });
                message.success("Changes saved for " + responseData.name)
                return responseData
            } catch (error) {
                message.error("Unable to save changes " + error.message, 10)
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
            apiFetch(`/api/voters/${id}`, { method: "DELETE" })
                .then(() => {
                    setVoterRows((prevRows) => prevRows.filter((row) => row._id !== id));
                    message.success("Voter deleted");
                    setShowModal(false);
                })
                .catch((err) => {
                    message.error(err.message || "Error deleting voter");
                    setShowModal(false);
                });
        }
        else {
            setShowModal(false)
        }
    };

    const handleProcessRowUpdateError = (error) => {
        message.error(error.message || "Unable to update voter");
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
                        density="comfortable"
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
