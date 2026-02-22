import React from "react";
import {
    Box,
    Container,
    FormControl,
    Stack,
    Typography,
    TextField,
    Button,
    Link
} from "@mui/material";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import Loader from "../../static/components/Loader";
import { message } from "antd";
import { apiFetch, ApiError } from "../../api/fetchClient";
import { setAccessToken } from "../token";

const Login = () => {
    //for collecting for data
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        imgCode: "",
    });
    const webcamRef = React.useRef(null);
    const webcamRefSecondary = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [imgBtn, setImgBtn] = React.useState(false);
    const [qr, setQr] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);

    const navigate = useNavigate();

    //updating formdata
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const videoConstraints = {
        width: 700,
        height: 700,
        facingMode: "user",
    };

    //webcam functions
    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setFormData((prevFormData) => ({ ...prevFormData, imgCode: imageSrc }));
    }, [webcamRef]);

    const captureSecondary = React.useCallback(() => {
        const imageSrc = webcamRefSecondary.current.getScreenshot();
        setImgSrc(imageSrc);
        setFormData((prevFormData) => ({ ...prevFormData, imgCode: imageSrc }));
    }, [webcamRefSecondary]);

    const handleImgBtn = () => {
        setImgBtn(true);
    };

    //reading qrcode
    const handleFileChange = async (e) => {
        e.preventDefault();
        const scanner = new Html5QrcodeScanner("qr-reader-container", {
            qrbox: {
                width: 200,
                height: 200,
            },
            fps: 20,
        });




        async function Success(result) {
            setFormData({ ...JSON.parse(result), imgCode: imgSrc });

            setQr(false);
            scanner.clear();
            document.getElementById("qr-reader-container").remove();
        }

        function errorQR() {}

        scanner.render(Success, errorQR);
    };

    //sending request to backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Image not captured
        if (formData.imgCode === "") {
            message.warning("Please verify yourself by taking a picture!");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await apiFetch("/api/auth/voter/login", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            if (!data?.token) throw new Error("Missing access token");
            setAccessToken(data.token);
            setIsLoading(false);
            navigate("/elections");
        } catch (error) {
            setIsLoading(false);
            if (error instanceof ApiError && error.status === 422) {
                message.error("Recognition failed. Try again!");
                return;
            }
            message.error(error.message || "An error occurred while processing your request.");
        }

    };

    return (

        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // minHeight: "100vh",
                border: "none",
            }}>

            {/* Loading animation*/}
            {isLoading && (
                <Box sx={{ width: "100vw", top: "80px", position: "absolute" }}>
                    <Loader />
                </Box>

            )}

            <form onSubmit={handleSubmit} className="login-form">
                <FormControl
                    sx={{
                        width: {
                            xs: "95vw",
                            sm: "75vw",
                            md: "50vw",

                            padding: "50px 30px",
                            borderRadius: "10px",
                        },
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        {/* webcam */}
                        <Box
                            sx={{
                                marginTop: "20px",
                                display: {
                                    xs: "none",
                                    sm: "block",
                                    backgroundColor: "grey",
                                },
                                backgroundImage:
                                    "url('https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg')",
                                backgroundSize: "cover",
                                position: "relative",
                                width: "50%",
                                borderRadius: "10px",
                                overflow: "hidden"
                            }}
                        >
                            {/* Photo */}
                            {!imgBtn && (
                                <Box
                                    sx={{
                                        backgroundColor: "black",
                                        textAlign: "center",
                                        padding: "0 auto"
                                    }}
                                >
                                    <Button
                                        onClick={handleImgBtn}
                                    >
                                        Click to take picture
                                    </Button>
                                </Box>
                            )}

                            {imgBtn && (
                                <Box sx={{
                                    position: "relative",
                                    textAlign: "center",
                                    backgroundColor: "black"
                                }}>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRefSecondary}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={videoConstraints}
                                    />
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            captureSecondary();
                                        }}
                                    >
                                        Capture photo
                                    </Button>

                                    {imgSrc && (
                                        <Box sx={{ position: "absolute", top: "0", left: "0" }}>
                                            <img src={imgSrc} alt="User" />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>

                        <Stack spacing={2} sx={{ width: { xs: "100%", sm: "50%" } }}>
                            <Typography component='h1' variant="h5">Welcome back!</Typography>

                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                onChange={e => handleChange(e)}
                                value={formData.email}
                                required
                            />

                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={e => handleChange(e)}
                                required
                            />

                            <Box
                                sx={{
                                    marginTop: "20px",
                                    display: {
                                        xs: "block",
                                        sm: "none",
                                        backgroundColor: "grey",
                                    },
                                    backgroundImage:
                                        "url('https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg')",
                                    backgroundSize: "cover",
                                    position: "relative",
                                }}
                            >
                                {/* Photo */}
                                {!imgBtn && (
                                    <Box
                                        sx={{
                                            backgroundColor: "black",
                                            textAlign: "center",
                                            padding: "0 auto",
                                        }}
                                    >
                                        <Button
                                            onClick={handleImgBtn}
                                        >
                                            Click to take picture
                                        </Button>
                                    </Box>
                                )}

                                {imgBtn && (
                                    <Box sx={{
                                        position: "relative",
                                        textAlign: "center",
                                        backgroundColor: "black"

                                    }}>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            videoConstraints={videoConstraints}
                                        />
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                capture();
                                            }}
                                        >
                                            Capture photo
                                        </Button>

                                        {imgSrc && (
                                            <Box sx={{ position: "absolute", top: "0", left: "0" }}>
                                                <img src={imgSrc} alt="User" />
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Box>

                            {qr && <Typography sx={{ textAlign: "center" }}>OR</Typography>}

                            {/* qrcode reader */}
                            <Box sx={{ textAlign: "center" }}>
                                <div id="qr-reader-container" style={{ width: "100%" }}></div>
                                {qr && (
                                    <Button onClick={handleFileChange}> Upload QR code </Button>
                                )}
                            </Box>


                            <Button type="submit" fullWidth variant="contained">
                                Sign in
                            </Button>

                            <p
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'baseline'
                                }}
                            >

                                <Link href="/auth/voter/register" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>

                            </p>

                        </Stack>
                    </Stack>
                </FormControl>
            </form>
        </Container>

    );
};

export default Login;
