import React from "react";
import {
    Typography,
    Container,
    Grid,
    Paper,
    Box,
    Link as MuiLink,
} from "@mui/material";
import { height, styled } from "@mui/system";
import Hero1 from "../images/hero1.png";
import Hero2 from "../images/hero2.png";
import Logo from "../images/logo.png";

const ChamferedImage = styled(Paper)({
    width: "100%", // Full width
    height: "350px", // Fixed height for uniformity
    borderRadius: "10px",
    overflow: "hidden",
    objectFit: "cover",
});

function Welcome() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default",
            }}
        >
            <Box component="main" sx={{ flex: 1, bgcolor: "background.paper" }}>
                <Box
                    sx={{
                        // py: { xs: 2, sm: 4, md: 8, lg: 12 }, // Reduced padding
                        minHeight: '90vh',
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: "background.paper",
                    }}
                >
                    <Container>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} lg={8}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <Typography variant="h3" component="h1">
                                        Welcome to Senkyo
                                    </Typography>
                                    <Typography variant="h4" component="p">
                                        Secure Elections on Ethereum
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={4}>
                                <ChamferedImage
                                    component="img"
                                    src={Logo}
                                    alt="Hero"
                                    sx={
                                        { height: 'auto' }
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box
                    id="features"
                    sx={{
                        // py: { xs: 4, md: 8, lg: 12 },
                        bgcolor: "background.paper",
                        minHeight: '90vh',
                        display: 'flex',
                        alignItems: 'center',
                    }} // Reduced padding
                >
                    <Container>
                        <Box sx={{ textAlign: "center", mb: 3 }}> {/* Reduced bottom margin */}
                            <Typography
                                variant="h3"
                                component="h2"
                                fontWeight="bold"
                                mt={2}
                            >
                                A New Era of Transparent Voting
                            </Typography>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                maxWidth="900px"
                                mx="auto"
                                mt={2}
                            >
                                Senkyo leverages blockchain technology to provide a trustworthy and transparent voting system. From student councils to college elections, we offer a secure, immutable platform.
                            </Typography>
                        </Box>

                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} lg={6}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            Immutable Records
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            Once recorded, votes on the Ethereum blockchain cannot be changed, ensuring absolute integrity.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            Transparent Process
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            All steps of the voting process are visible and verifiable, building trust in the results.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            Fraud Prevention
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            Our decentralized system prevents tampering, eliminating any possibility of vote manipulation.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <ChamferedImage
                                    component="img"
                                    src={Hero2}
                                    alt="Secure Voting"

                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box
                    id="about"
                    sx={{
                        // py: { xs: 4, md: 8, lg: 12 },
                        bgcolor: "background.paper",
                        minHeight: '90vh',
                        display: 'flex',
                        alignItems: 'center',
                    }} // Reduced padding
                >
                    <Container>
                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Typography
                                variant="h3"
                                component="h2"
                                fontWeight="bold"
                                mt={2}
                            >
                                Empowering Students with Blockchain
                            </Typography>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                maxWidth="900px"
                                mx="auto"
                                mt={2}
                            >
                                Senkyo is a decentralized voting platform that ensures security and transparency in every election. We aim to make democracy accessible to students by using cutting-edge technology.
                            </Typography>
                        </Box>

                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} lg={6}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            Decentralized Platform
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            Our Ethereum-based system prevents central control, giving students more power in the voting process.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            Empowering Students
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            Senkyo fosters engagement and accountability by empowering students to make their voices heard.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            Trusted by Institutions
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            Institutions trust us to deliver fair, tamper-proof elections that inspire confidence.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <ChamferedImage
                                    component="img"
                                    src={Hero1}
                                    alt="About Senkyo"

                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box
                    sx={{
                        py: { xs: 4, md: 8, lg: 12 }, // Reduced padding
                        // borderTop: 1,
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Container>

                        <Typography variant="h4" component="h2" fontWeight="bold" textAlign='center'>
                            Join the Future of Voting
                        </Typography>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            mt={2}
                            textAlign='center'
                        // maxWidth="600px"
                        >
                            Secure your elections with Senkyo and help build a transparent future for student democracy.
                        </Typography>

                    </Container>
                </Box>
            </Box>

            <Box
                component="footer"
                sx={{
                    py: 4, // Reduced padding
                    borderTop: 1,
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    px: { xs: 2, md: 6 },
                    bgcolor: "background.paper",
                }}
            >
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ flexGrow: 1 }}
                >
                    © 2024 Senkyo. All rights reserved.
                </Typography>

            </Box>
        </Box >
    );
}

export default Welcome;
