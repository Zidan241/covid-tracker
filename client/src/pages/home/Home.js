import React, { useContext } from "react";
import { StoreContext } from "../../authentication/store";
import {Fab,AppBar,Toolbar,IconButton,Typography,Menu,Avatar,Tooltip,MenuItem} from '@mui/material';
import './styling/home.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { logout } from "../../authentication/services";
import Map from "./components/Map";
import AddIcon from '@mui/icons-material/Add';

export default function Home (props) {
  const { user, resetAuth } = useContext(StoreContext);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    resetAuth();
  };

  return (
    <div className="homeContainer">
      <AppBar className="homeTabBar" position="static">
          <Toolbar className="homeToolbar" disableGutters>
            <div/>
            <div className="homeHeadingContainer">
              <Typography className="loginHeading1">Stay</Typography>
              <Typography className="loginHeading2">Safe!</Typography>
            </div>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={user.picture}/>
                  {Boolean(anchorElUser)?
                    <KeyboardArrowUpIcon className="homeHeadingAvatarIcon"/>
                  :
                    <KeyboardArrowDownIcon className="homeHeadingAvatarIcon"/>
                  }
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
              </Menu>
          </Toolbar>
      </AppBar>
      <Map/>
      <Fab className="homeFab" color="blue" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  );
};
