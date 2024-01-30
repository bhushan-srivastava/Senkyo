import Typography from '@mui/joy/Typography/Typography';
import { DataGrid, GridDeleteIcon, GridToolbar } from '@mui/x-data-grid';
// import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';

import { Paper } from '@mui/material';
import { useState } from 'react';

const Voters = () => {
    const rowsArr = [
        { id: 1, photo: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", voterName: "Abc", email: "abc@ves.ac.in", group: "FYMCA/A Boys", verified: true },
        { id: 2, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", voterName: "Xyz", email: "xyz@ves.ac.in", group: "FYMCA/B Boys", verified: false },

    ];

    const [voterRows, setVoterRows] = useState(rowsArr);

    const columns = [
        {
            field: 'photo',
            headerName: 'Photo',
            width: 150,
            filterable: false,
            sortable: false,
            renderCell: (params) => <Avatar src={params.value} size='lg' />,
            //  const buffer = Buffer.from(imageBuffer, 'binary').toString('base64');
            // // setImageSrc(`data:image/jpeg;base64,${buffer}`);
            // renderCell: (params) => <Avatar src={`data:image/jpeg;base64,${buffer}`} size='lg' />,
        },
        {
            field: 'voterName',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 150,
            editable: true,
        },
        {
            field: 'group',
            headerName: 'Group',
            width: 150,
            editable: true,
            type: "singleSelect",
            valueOptions: ["FYMCA/A Boys", "FYMCA/A Girls", "FYMCA/B Boys", "FYMCA/B Girls"]
        },
        {
            field: 'verified',
            headerName: 'Verified',
            width: 150,
            editable: true,
            type: 'boolean',
            // type: "singleSelect",
            // valueOptions: ["Yes", "No"]
        },
        {
            field: 'actions', headerName: 'Actions', renderCell: (params) => {
                return (
                    <IconButton
                        onClick={(e) => {
                            const filteredRows = rowsArr.filter((ele) => ele !== params.row)
                            setVoterRows(filteredRows)
                        }}
                        variant='plain'
                    >
                        <GridDeleteIcon />
                    </IconButton>
                );
            }
        },
    ];



    return (

        <Paper variant="outlined">
            <br />
            <Typography level='h3' sx={{ marginLeft: '2vw' }}>
                Admin: Voters Panel
            </Typography>

            <DataGrid
                sx={
                    {
                        border: "none",
                        marginLeft: "2vw"
                    }
                }
                rows={voterRows}
                columns={columns}
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
                disableRowSelectionOnClick
                editMode='row'/** not sure */
            />
        </Paper>

    );
}

export default Voters;


