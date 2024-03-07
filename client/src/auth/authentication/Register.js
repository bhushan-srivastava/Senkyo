import React from "react";
import {
  Box,
  Container,
  FormControl,
  Stack,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,

} from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";



const Register = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    course: "",
    division: "",
    imgCode: "",
  });

  const navigate = useNavigate();

  const videoConstraints = {
    width: 320,
    height: 400,
    facingMode: "user",
  };

  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [imgBtn, setImgBtn] = React.useState(false);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setFormData((prevFormData) => ({ ...prevFormData, imgCode: imageSrc }));
  }, [webcamRef, setImgSrc]);

  const handleImgBtn = () => {
    setImgBtn(true);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //Image not captured
    if (formData.imgCode === "") {
      alert("Please click a picture for future verification!");
      return;
    }

    //Send a POST request
    axios
      .post(process.env.REACT_APP_BASE_SERVER_URL + "/auth/register", formData)
      .then(function (response) {
        if (response.data.success) {
          alert("User created successfullty");
          navigate("/auth/login");
          console.log(response);
        } else {
          alert("Something went wrong");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };



  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <form onSubmit={handleSubmit} className="register-form">
        <FormControl
          sx={{
            width: {
              xs: "100vw",
              md: "50vw",
              border: "1px solid white",
              padding: "50px 30px",
              borderRadius: "10px",
            },
          }}
        >
          <Stack direction="row" spacing={2}>
            <Box
              sx={{
                width: "50%",
                display: { xs: "none", sm: "block", backgroundColor: "grey" },
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
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    margin: "0 auto",
                  }}
                >
                  <Button onClick={handleImgBtn}>Click to take picture</Button>
                </Box>
              )}

              {imgBtn && (
                <Box sx={{ position: "relative" }}>
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
                      <img src={imgSrc} />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Stack spacing={2} sx={{ width: { xs: "100%", sm: "50%" } }}>
              <Typography variant="h4">Register</Typography>

              <TextField
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                required
              />

              <TextField
                label="Name"
                name="name"
                type="text"
                onChange={handleChange}
                value={formData.name}
                required
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Course"
                  name="course"
                  type="text"
                  onChange={handleChange}
                  value={formData.course}
                  required
                />

                <FormControl fullWidth>
                  <InputLabel id="division-select">Division</InputLabel>
                  <Select
                    labelId="division-select"
                    label="Division"
                    name="division"
                    type="text"
                    onChange={handleChange}
                    value={formData.division}
                    defaultValue={"FYMCA-A"}
                    required
                  >
                    <MenuItem value={"FYMCA-A"}>FYMCA-A</MenuItem>
                    <MenuItem value={"FYMCA-B"}>FYMCA-B</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
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

                    }}
                  >
                    <Button onClick={handleImgBtn} sx={{ display: 'block', margin: '0' }}>
                      Click to take picture
                    </Button>
                  </Box>
                )}

                {imgBtn && (
                  <Box sx={{ position: "relative" }}>
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
                        <img src={imgSrc} />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "baseline" }}
              >
                <Link to={"/auth/login"}>Go To Login</Link>

                <Button type="submit " variant="contained">
                  Register
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </FormControl>
      </form>
    </Container>
  );
};

export default Register;