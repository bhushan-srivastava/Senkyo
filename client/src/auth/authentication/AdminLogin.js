import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from "../../static/components/Loader";
import { message } from "antd";
import { setAccessToken } from "../token";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const dataToSend = {
      email: data.get('email'),
      password: data.get('password'),
    }

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        setIsLoading(false);
        message.error(responseData?.message || `Request failed with status ${response.status}`, 10);
        return;
      }

      if (responseData?.message === 'Login successful') {
        if (!responseData.token) throw new Error("Missing access token");
        setAccessToken(responseData.token);
        setIsLoading(false);
        message.success(responseData.message);
        navigate("/voters");
      }

      else {
        setIsLoading(false);
        message.error(responseData?.message || "Login unsuccessful");
      }

    } catch (error) {
      setIsLoading(false);
      message.error(error.message, 10);
    }
  }

  return (

    <Container component="main" maxWidth="xs">

      <CssBaseline />
      {
        isLoading &&
        <Box sx={{ width: "100vw", top: "80px", position: "absolute" }}>
          <Loader />
        </Box>
      }
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar variant='rounded' sx={{ m: 1, backgroundColor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome back!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}

          >
            Sign in
          </Button>

        </Box>
      </Box>
    </Container>

  );
}

export default AdminLogin;
