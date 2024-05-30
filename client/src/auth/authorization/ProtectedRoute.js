import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Loader from "../../static/components/Loader";
import { useEffect, useState } from "react";
import getAuth from "./authorization";
import Typography from "@mui/joy/Typography/Typography";
import { Stack } from "@mui/material";
import IconButton from '@mui/joy/IconButton';
import Logout from "@mui/icons-material/Logout";
import { message } from "antd"

const ProtectedRoute = () => {
    const [authResult, setAuthResult] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        getAuth()
            .then((result) => {
                if (mounted) {
                    setAuthResult(result); // This line 2
                    setIsLoading(false); // This line 1
                }
            })
            .catch((error) => {
                if (mounted) {
                    setAuthResult({ message: "Unauthorized", isAdmin: false });
                    setIsLoading(false);
                }
            });

        return () => {
            mounted = false;
        }
    }, []);

    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'GET'
            })

            if (response.status == 200) {
                setIsLoading(false)
                message.success("Logout successful")
                navigate('/')
            } else {
                setIsLoading(false)
                message.error('Logout unsuccessful')
            }
        }
        catch (error) {
            console.log("Error while logging out", error.message);

            setIsLoading(false)
            message.error('Logout unsuccessful')
        }
    }

    return (

        isLoading ?
            <Loader />
            :
            authResult.message == "Authorized" ?
                <>
                    <Stack direction="row" spacing={2} sx={{ marginLeft: "35px", marginBottom: "2vh", marginTop: "2vh", marginRight: "40px", display: 'flex', justifyContent: 'space-between' }}>
                        <Typography level="h3" sx={{ marginBottom: "2vh", }}>
                            Welcome
                            {
                                " " + decodeURI(document.cookie.replace('name=', '')).split(' ')[0]

                                + "!"
                            }
                        </Typography>

                        <IconButton
                            onClick={logout}
                            variant='plain'
                        >
                            <Logout />
                        </IconButton>
                    </Stack>
                    <Outlet context={{ isAdmin: authResult.isAdmin }} />
                </>
                :
                <Navigate to="/" replace />

    );


};

export default ProtectedRoute;