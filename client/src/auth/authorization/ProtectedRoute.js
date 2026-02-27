import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Loader from "../../static/components/Loader";
import { useEffect, useState } from "react";
import getAuth from "./authorization";
import IconButton from '@mui/joy/IconButton';
import Logout from "@mui/icons-material/Logout";
import { message } from "antd"
import { clearAccessToken, getAccessToken } from "../token";

const ProtectedRoute = () => {
    const [authResult, setAuthResult] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        getAuth()
            .then((result) => {
                if (mounted) {
                    setAuthResult(result);
                    setIsLoading(false);
                }
            })
            .catch(() => {
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
            const token = getAccessToken();
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await response.json().catch(() => null);

            clearAccessToken();
            setIsLoading(false);

            if (!response.ok) {
                message.error(data?.message || 'Logout unsuccessful');
                navigate('/');
                return;
            }

            message.success(data?.message || "Logout successful");
            navigate('/');
        }
        catch (error) {
            clearAccessToken();
            setIsLoading(false);
            message.error(error.message || 'Logout unsuccessful');
            navigate('/');
        }
    }

    return (

        isLoading ?
            <Loader />
            :
            authResult.message === "Authorized" ?
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

                    <Outlet context={{ isAdmin: authResult.isAdmin, user: authResult.user, role: authResult.role }} />
                </>
                :
                <Navigate to="/" replace />

    );


};

export default ProtectedRoute;
