import React, { useContext, useState, useEffect} from "react";
import { StoreContext } from "../../authentication/store";
import { Fab, AppBar, Toolbar, IconButton, Typography, Menu, Avatar, Tooltip, MenuItem } from '@mui/material';
import './styling/home.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { logout } from "../../authentication/services";
import Map from "./components/Map";
import AddIcon from '@mui/icons-material/Add';
import InputTempForm from "./components/InputTempForm";
import axios from 'axios';
import { link } from '../../helpers/constants';
import { useHistory } from "react-router-dom";

export default function Home(props) {
  let history = useHistory();
  const { user, resetAuth } = useContext(StoreContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    props.setLoading(true);
    axios.get(`${link}temp/getAllTemps`).then(res => {
      props.setLoading(false);
      const resData = res.data.data;
      setData(resData);
    }).catch(err => {
      props.setLoading(false);
      const errorMsg = err.response?.data.error || "Something went wrong. Please try again.";
      props.handleError(errorMsg, "error");
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          <div />
          <div className="homeHeadingContainer">
            <Typography className="loginHeading1">Stay</Typography>
            <Typography className="loginHeading2">Safe!</Typography>
          </div>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src={user && user.picture} />
              {Boolean(anchorElUser) ?
                <KeyboardArrowUpIcon className="homeHeadingAvatarIcon" />
                :
                <KeyboardArrowDownIcon className="homeHeadingAvatarIcon" />
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
            <MenuItem onClick={()=>{history.push('/profile')}}>
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Map data={data} setLoading={props.setLoading} handleError={props.handleError} />
      <Fab onClick={handleClickOpen} className="homeFab" color="success" aria-label="add">
        <AddIcon />
      </Fab>
      <InputTempForm setData={setData} open={open} setLoading={props.setLoading} handleClose={handleClose} handleError={props.handleError} />
    </div>
  );
};
