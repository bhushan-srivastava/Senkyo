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
  Modal,
  Link
} from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../static/components/Loader";
import { message } from "antd";

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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 120,
      },
    },
  };

  const courses = [
    "FY MCA", "SY MCA",
    "FY CMPN", "SY CMPN", "TY CMPN", "BE CMPN",
    "FY INFT", "SY INFT", "TY INFT", "BE INFT"
  ]

  const divisions = ['A', 'B']
  const genders = ['Male', 'Female']

  const videoConstraints = {
    width: 700,
    height: 700,
    facingMode: "user",
  };

  const webcamRef = React.useRef(null);
  const webcamRefSecondary = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [imgBtn, setImgBtn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

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

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //Image not captured
    if (formData.imgCode === "") {
      message.warning("Please click a picture for future verification!");
      return;
    }

    // Start loading
    setIsLoading(true);

    //Send a POST request
    axios
      .post("/api/auth/voter/register", formData)
      .then(function (response) {
        if (response.data.success) {
          console.log(response);
          console.log(response.data.url);

          // Automatically download the image
          const link = document.createElement("a");
          link.href = response.data.url;
          link.download = "image.jpg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          message.info("QR Code downloaded");

          setTimeout(() => {
            setIsLoading(false);
            // Navigate to login page
            navigate("/auth/login");
          }, 1000); // 1 second delay so that user can see the 'QR Code Downloaded' message
        } else {
          setIsLoading(false);
          message.error("Something went wrong: " + (response.data.message || ""));
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        message.error(error.response?.data?.message || error.message);
        console.log(error);
      });
  };

  return (


    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // minHeight: "100vh",
        border: "none",
      }}
    >
      {/* Loading animation*/}
      {isLoading && (
        <Box sx={{ width: "100vw", top: "80px", }}>
          <Loader />
        </Box>

      )}

      {/* success msg ends */}

      <form onSubmit={handleSubmit} className="register-form">
        <FormControl
          sx={{
            width: {
              xs: "95vw",
              sm: "75vw",
              // md: "50vw",
              padding: "50px 30px",
              borderRadius: "10px",
            },
          }}
        >
          <Stack direction="row" spacing={2}>
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
                    textAlign: "center",
                    padding: "0 auto",
                    backgroundColor: "black",

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
                      <img src={imgSrc} alt="user photo" />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Stack spacing={2} sx={{ width: { xs: "100%", sm: "50%" } }}>
              <Typography variant="h5" component='h1'>Join Senkyo.</Typography>

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

                <FormControl fullWidth>
                  <InputLabel id="course-select">Course</InputLabel>
                  <Select
                    labelId="course-select"
                    label="Course"
                    name="course"
                    type="text"
                    onChange={handleChange}
                    value={formData.course}
                    required
                    MenuProps={MenuProps}
                  >
                    {courses.map((course, index) =>
                      <MenuItem value={course}>{course}</MenuItem>
                    )}

                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="division-select">Division</InputLabel>
                  <Select
                    labelId="division-select"
                    label="Division"
                    name="division"
                    type="text"
                    onChange={handleChange}
                    value={formData.division}
                    required
                    MenuProps={MenuProps}
                  >
                    {divisions.map((division, index) =>
                      <MenuItem value={division}>{division}</MenuItem>
                    )}

                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="gender-select">Gender</InputLabel>
                  <Select
                    labelId="gender-select"
                    label="Gender"
                    name="gender"
                    type="text"
                    onChange={handleChange}
                    value={formData.gender}
                    required
                    MenuProps={MenuProps}
                  >
                    {genders.map((gender, index) =>
                      <MenuItem value={gender}>{gender}</MenuItem>
                    )}

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
                      textAlign: "center",
                      padding: "0 auto",
                      backgroundColor: "black",
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
                    backgroundColor: "black",
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
                        <img src={imgSrc} alt="user photo" style={{ height: "100%s" }} />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              <Button type="submit" fullWidth variant="contained">
                Register
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

                <Link href="/auth/voter/login" variant="body2">
                  Already have an account? Sign in
                </Link>

              </p>

            </Stack>
          </Stack>
        </FormControl>
      </form >
    </Container >

  );
};

export default Register;
