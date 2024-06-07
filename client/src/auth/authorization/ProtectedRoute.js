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


                    <IconButton
                        onClick={logout}
                        variant='plain'
                        sx={{
                            position: 'fixed',
                            top: 20,
                            right: 15,
                            zIndex: 1000
                        }}
                    >
                        <Logout />
                    </IconButton>

                    <Outlet context={{ isAdmin: authResult.isAdmin }} />
                </>
                :
                <Navigate to="/" replace />

    );


};

export default ProtectedRoute;