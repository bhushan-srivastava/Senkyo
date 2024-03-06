// import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import './admin.css';

import { Outlet } from "react-router-dom";

const Admin = () => {
    return (

        <Box className="admin-box">


            {/* <Typography level='h2' varient='span'>
                Admin
            </Typography> */}

            <Outlet />
        </Box>

    );
}

export default Admin;