import Typography from '@mui/joy/Typography/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import Box from '@mui/joy/Box';
import { Paper } from '@mui/material';
import IconButton from '@mui/joy/IconButton';
import { useState } from 'react';
import { GridDeleteIcon } from '@mui/x-data-grid';

const Elections = () => {

    const electionsArr = [
        { id: 1, date: new Date("11-12-2023"), electionName: "SORT", candidates: "Prasad Gade, Prashant Gupta", group: "FYMCA/A BOYS", expires: new Date("December 23, 2023, 13:00:00"), status: "Completed" },
        { id: 2, date: new Date("12-12-2023"), electionName: "CR", candidates: "Radhika Gangan, Nikita Kundu", group: "FYMCA/A GIRLS", expires: new Date("December 24, 2023, 13:00:00"), status: "Pending" },
    ];

    const [electionRows, setElectionRows] = useState(electionsArr);

    const columns = [
        {
            field: "date",
            headerName: 'Date',
            type: "date",
            editable: true
        },
        {
            field: 'electionName',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'candidates',
            headerName: 'Candidates',
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
            field: 'expires',
            headerName: 'Expires',
            width: 150,
            editable: true,
            type: "dateTime",
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            editable: true,
            type: "singleSelect",
            valueOptions: ["Pending", "Ongoing", "Completed"]
        },
        {
            field: 'actions', headerName: 'Actions', renderCell: (params) => {
                return (
                    <IconButton
                        onClick={(e) => {
                            const filteredRows = electionRows.filter((ele) => ele !== params.row)
                            setElectionRows(filteredRows)
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
                Admin: Elections Panel
            </Typography>

            <DataGrid
                sx={
                    {
                        border: "none",
                        marginLeft: "2vw"
                    }
                }
                rows={electionRows}
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

export default Elections;