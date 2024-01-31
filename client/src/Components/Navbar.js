// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:1000px)');

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <div className='navbar'>
      <AppBar position="static" sx={{ backgroundColor: 'White', color: '#012636' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className='logo-container'>
            <img className='logo' src='https://i.ibb.co/XZV4pmX/Ether-Ballot-removebg-preview.png' alt='logo'></img>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
              EtherBallot
            </Typography>
          </div>
          <div>
            {isMobile && (
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                sx={{ ml: 2 }}
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
            {!isMobile && (
              <>
                <Button color="inherit" href='/'>About Us</Button>
                <Button color="inherit" href='/admin/elections'>Elections</Button>
                <Button color="inherit" href='/admin/voters'>Voters</Button>
                <Button color="inherit" href='/'>Candidates</Button>
                {!isLogin && <Button color="inherit" >Login</Button>}
                {isLogin && <Button color="inherit">My Account</Button>}


              </>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {isMobile && menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'white',
            zIndex: 999,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="close menu"
            edge="end"
            onClick={handleMenuClose}
            sx={{ position: 'absolute', top: 0, right: 0, mt: 1, mr: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <div className="navbar-drawer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '64px', color: 'white', backgroundColor: '#012636' }}>
            {['About Us', 'Elections', 'Voters', 'Candidates', 'Login'].map((text, index) => (
              <Button key={text} color="inherit" onClick={handleMenuClose} sx={{ mb: 2 }} href={text.toLowerCase()}>
                {text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
