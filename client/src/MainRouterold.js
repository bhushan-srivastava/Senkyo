import { BrowserRouter, Route, Routes } from "react-router-dom"
import ErrorPage from "./ErrorPage"
import Welcome from "./static/pages/Welcome";
import Admin from "./admin/Admin"
import Elections from "./elections/Elections"
import Voters from "./voters/Voters"
// import Candidates from "./candidates/Candidates"
import Vote from "./voters/Vote"
import Results from "./elections/Resuts"
import Register from "./auth/authentication/Register"
import Login from "./auth/authentication/Login"
import AdminLogin from "./auth/authentication/AdminLogin"


const MainRouter = () => {


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />

                <Route path="/admin" element={<Admin />} >
                    <Route path="elections" element={<Elections />} />
                    <Route path="voters" element={<Voters />} />
                    <Route path="login" element={<AdminLogin />} />
                    {/* <Route path="candidates" element={<Candidates />} /> */}
                </Route>

                <Route path="/results" element={<Results />} >
                    <Route path=":electionId" element={<Results />} />
                </Route>

                <Route path="/vote" element={<Vote />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/login" element={<Login />} />

                <Route path="*" element={
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