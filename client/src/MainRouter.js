import { BrowserRouter, Route, Routes } from "react-router-dom"
import ErrorPage from "./ErrorPage"
import Welcome from "./static/pages/Welcome";
import Elections from "./elections/Elections"
import Voters from "./voters/Voters"
import Register from "./auth/authentication/Register"
import Login from "./auth/authentication/Login"
import AdminLogin from "./auth/authentication/AdminLogin";
import ProtectedRoute from "./auth/authorization/ProtectedRoute";
import ElectionDetails from "./elections/ElectionDetails";
import CreateEditElection from "./elections/CreateEditElection";


const MainRouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />


                <Route path="/auth/admin/login" element={<AdminLogin />} />

                <Route path="/auth/voter/register" element={<Register />} />
                <Route path="/auth/voter/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    {/* only admin */}
                    <Route
                        path="/voters"
                        element={<Voters />}
                    />

                    {/* admin and voter */}
                    <Route
                        path="/elections"
                        element={<Elections />}
                    />

                    {/* only admin */}
                    <Route
                        path="/elections/create"
                        element={<CreateEditElection />}
                    />

                    {/* only admin  */}
                    <Route
                        path="/elections/:electionID/edit"
                        element={<CreateEditElection />}
                    />
                    {/* only admin  */}
                    <Route
                        path="/elections/:electionID"
                        element={<ElectionDetails />}
                    />
                </Route>


                {/* Error route */}
                <Route
                    path="*"
                    element={
                        <ErrorPage
                            statusCode="404"
                            errorTitle="404"
                            subTitle="Sorry, the page you visited does not exist."
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default MainRouter;