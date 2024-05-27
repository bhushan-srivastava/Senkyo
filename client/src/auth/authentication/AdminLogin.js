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
import axios from 'axios';
import { message } from "antd";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataToSend = {
      email: data.get('email'),
      password: data.get('password'),
    }

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })

      const responseData = await response.json()

      if (responseData.message === 'Login successful') {
        setIsLoading(false)
        message.success(responseData.message)
        navigate("/voters")
      }

      else {
        setIsLoading(false)
        message.error(responseData.message)
      }

    } catch (error) {
      message.error(error.message)
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
        <Avatar sx={{ m: 1, bgcolor: "primary" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color={"primary"}>
          Sign in
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