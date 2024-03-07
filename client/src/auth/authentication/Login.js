import React from 'react'
import { Box, Container, FormControl, Stack, Typography, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material'

const Login = () => {
    return (
        <Container sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",

        }}
        >
            <FormControl sx={{ width: { xs: "100vw", md: "50vw", border: "1px solid black", padding: "50px 30px", borderRadius: "10px", border: "1px solid white" } }}>
                <Stack direction="row" spacing={2} >
                    <Box sx={{ width: "50%", display: { xs: "none", sm: "block", backgroundColor: "grey" } }}>
                        {/* Photo */}

                    </Box>
                    <Stack spacing={2} sx={{ width: { xs: "100%", sm: "50%" } }}>

                        <Typography variant='h4'>Login</Typography>

                        <TextField id="" label="Email" />

                        <TextField
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                        />



                        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
                            <Button href='/auth/register'>Create an account</Button>
                            <Button type="submit " variant="contained">Login</Button>
                        </Stack>

                    </Stack>
                </Stack>


            </FormControl>
        </Container>
    )
}

export default Login