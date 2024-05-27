// Navbar.js
import React from 'react';
import { AppBar, Toolbar, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/joy/Link';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';

import logo from '../images/logo.png';

import "./Navbar.css";



const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:1000px)');

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (

    <div className='navbar'>
      <AppBar sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className='logo-container'>
            <img className='logo' src={logo} alt='logo' />
            {/* <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.7rem' }}> */}
            <Link
              level="h6"
              underline="none"
              variant="plain"
              sx={{ fontWeight: 'bold', fontSize: '1.7rem' }}
              href='/'
            >
              {/* <img className='logo' src={logo} alt='logo'></img> */}
              EtherBallot
            </Link>
            {/* </Typography> */}
          </div>
          <div>
            {isMobile && (
              <IconButton
                size="large"
                edge="end"
                color="primary"
                aria-label="menu"
                sx={{ ml: 2 }}
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
                    color="primary"
                    size='lg'
                  >
                    Admin
                  </MenuButton>

                  <Menu>
                    <MenuItem>
                      <Link underline='none' href='/auth/admin/login'>Login</Link>
                    </MenuItem>

                    <MenuItem>
                      <Link underline='none' href='/voters'>Voters</Link>
                    </MenuItem>

                    <MenuItem>
                      <Link underline='none' href='/elections'>Elections</Link>
                    </MenuItem>

                  </Menu>

                </Dropdown>

                <Dropdown>
                  <MenuButton
                    variant="plain"
                    color="primary"
                    size='lg'
                  >
                    Voter
                  </MenuButton>

                  <Menu>
                    <MenuItem>
                      <Link underline='none' href='/auth/voter/register'>Register</Link>
                    </MenuItem>

                    <MenuItem>
                      <Link underline='none' href='/auth/voter/login'>Login</Link>
                    </MenuItem>

                    <MenuItem>
                      <Link underline='none' href='/elections'>Elections</Link>
                    </MenuItem>

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
              color: 'primary'
            }}

            onClick={handleMenuToggle}
          >

            <div className="navbar-drawer">

              <br />
              <Divider>
                <Chip
                  color="primary"

                  size="lg"
                  variant="soft"
                  sx={{ borderRadius: '6px' }}
                >
                  Admin
                </Chip>
              </Divider>
              <br />
              <Link underline='none' variant="plain" href='/auth/admin/login'>Login</Link>
              <br />
              <Link underline='none' variant="plain" href='/voters'>Voters</Link>
              <br />
              <Link underline='none' variant="plain" href='/elections'>Elections</Link>
              <br />
              <br />
              <Divider>
                <Chip
                  color="primary"

                  size="lg"
                  variant="soft"
                  sx={{ borderRadius: '6px' }}
                >
                  Voter
                </Chip>
              </Divider>
              <br />
              <Link underline='none' variant="plain" href='/auth/voter/register'>Register</Link>
              <br />
              <Link underline='none' variant="plain" href='/auth/voter/login'>Login</Link>
              <br />
              <Link underline='none' variant="plain" href='/elections'>Elections</Link>
              <br />

            </div>
          </div>
        )
      }
    </div>
  );
};

export default Navbar;