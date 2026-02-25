// Navbar.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Link, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';
import { Link as JoyUiLink } from '@mui/joy';

import logo from '../images/logo.png';

import "./Navbar.css";



const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:1000px)');

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const adminNavRoutes = [
    { text: "Sign in", href: "/auth/admin/login", key: "admin-login" },
    { text: "Voters", href: "/voters", key: "admin-voters" },
    { text: "Elections", href: "/elections", key: "admin-elections" },
  ]

  const voterNavRoutes = [
    { text: "Create an account", href: "/auth/voter/register", key: 'voter-register' },
    { text: "Sign in", href: "/auth/voter/login", key: 'voter-login' },
    { text: "Elections", href: "/elections", key: 'voter-elections' },
  ]

  return (

    <div className='navbar'>
      <AppBar sx={{
        backgroundColor: 'Background',
        boxShadow: 'none',
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className='logo-container'>
            <img className='logo' src={logo} alt='logo' />
            {/* <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.7rem' }}> */}
            <JoyUiLink
              level="h6"
              underline="none"
              variant="plain"
              sx={{ fontWeight: 'bold', fontSize: '1.7rem' }}
              href='/'
              color='neutral'
            >
              {/* <img className='logo' src={logo} alt='logo'></img> */}
              Senkyo
            </JoyUiLink>
            {/* </Typography> */}
          </div>
          <div>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                aria-label="menu"
                sx={{ mr: 5 }}
                onClick={handleMenuToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
            {!isMobile && (
              <>

                <Dropdown>
                  <MenuButton
                    variant="plain"
                    size='lg'
                  // color='black'
                  >
                    Admin
                  </MenuButton>

                  <Menu>

                    {
                      adminNavRoutes.map((route, index) =>
                        <MenuItem key={route.key}>
                          <Link
                            href={route.href}
                            underline='none'
                            color='InfoText'
                            // variant='body2'
                            sx={{ width: '100%' }} 
                          >
                            {route.text}
                          </Link>
                        </MenuItem>
                      )
                    }

                  </Menu>

                </Dropdown>

                <Dropdown>
                  <MenuButton
                    variant="plain"
                    size='lg'
                    sx={{
                      mr: 5
                    }}
                  >
                    Voter
                  </MenuButton>

                  <Menu>

                    {
                      voterNavRoutes.map((route, index) =>
                        <MenuItem key={route.key}>
                          <Link
                            href={route.href}
                            underline='none'
                            color='InfoText'
                            // variant='subtitle1'
                            sx={{ width: '100%' }}
                          >
                            {route.text}
                          </Link>
                        </MenuItem>
                      )
                    }


                  </Menu>

                </Dropdown>


              </>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {
        isMobile && menuOpen && (
          <div
            style={{
              position: 'relative',
              // top: 0,
              width: '100vw',
              height: '100vh',
              top: '50px',
              left: 0,
              paddingTop: '25px',
              backgroundColor: 'Background',
            }}

            onClick={handleMenuToggle}
          >

            <div className="navbar-drawer">

              <br />
              <Divider>
                <Chip
                  size="lg"
                  variant="soft"
                  sx={{ borderRadius: '6px' }}
                >
                  Admin
                </Chip>
              </Divider>
              <br />
              {
                adminNavRoutes.map((route, index) => {
                  return (
                    <Link
                      href={route.href}
                      underline='none'
                      // color='InfoText'
                      // variant='subtitle1'
                      sx={{ width: '100%', mt: 1.5, mb: 1.5, textAlign: 'center' }}
                    >
                      {route.text}
                    </Link>
                  )
                })
              }
              <br />
              <Divider>
                <Chip
                  size="lg"
                  variant="soft"
                  sx={{ borderRadius: '6px' }}
                >
                  Voter
                </Chip>
              </Divider>
              <br />


              {
                voterNavRoutes.map((route, index) => {
                  return (
                    <Link
                      href={route.href}
                      underline='none'
                      // color='InfoText'
                      // variant='subtitle1'
                      sx={{ width: '100%', mt: 1.5, mb: 1.5, textAlign: 'center' }}
                    >
                      {route.text}
                    </Link>
                  )
                })
              }

            </div>
          </div>
        )
      }
    </div>
  );
};

export default Navbar;