import React, { useEffect, useState , useContext } from "react";
import {
  Switch,
  Route
} from "react-router-dom";
import Login from './pages/auth/Login';
import Home from './pages/home/Home';
import Register from "./pages/auth/Register";
import Authorize from "./pages/auth/Authorize";
import { SnackbarProvider, useSnackbar } from 'notistack';
import './styling/app.scss';
import {CircularProgress,Backdrop} from '@mui/material';
import ProctectedRoute from "./ProtectedRoute";
import {Redirect , useHistory} from 'react-router-dom';
import { getUser , logout} from "./authentication/services";
import { StoreContext } from "./authentication/store";
import Profile from "./pages/profile/Profile";

function App() {
  let history = useHistory();
  const {
    authToken,
    setUserData,
    authenticateUser,
    resetAuth
  } = useContext(StoreContext);
  const [ loading, setLoading ] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (message,variant) => {
    enqueueSnackbar(message,{variant});
  };

  const handleLogout = () => {
    logout();
    resetAuth();
  };

  useEffect(() => {
    const doReq = async () => {
      try {
        setLoading(true);
        const user = await getUser(authToken);
        const { email, name, picture, sub: id } = user;
        setUserData({ email, name, picture, id });
        authenticateUser(authToken);
        history.replace('/');
        setLoading(false);
      } catch (err) {
        setLoading(false);
        handleLogout();
        const errorMsg = err.response?.data.error || "Something went wrong. Please try again.";
        handleClick(errorMsg,"error");
        console.log(err);
      }
    }
    if(authToken)
      doReq();

  }, []);

  return (
    <div className="app">
        <Switch>
          <Route path="/authorize" render={(prop) => <Authorize {...prop} setLoading={setLoading}/>}/>
          <Route path="/login" render={(prop) => <Login {...prop} setLoading={setLoading} handleError={handleClick}/>}/>
          <Route path="/register" render={(prop) => <Register {...prop} setLoading={setLoading} handleError={handleClick}/>}/>
          <ProctectedRoute path="/dashboard" render={(prop) => <Home {...prop} setLoading={setLoading} handleError={handleClick}/>}/>
          <ProctectedRoute path="/profile" render={(prop) => <Profile {...prop} setLoading={setLoading} handleError={handleClick}/>}/>
          <Route path="/" render={(prop) => <Redirect to={'/dashboard'}/>}/>
        </Switch>
        <Backdrop
        sx={{ color: '#fff', zIndex: 1301 }}
        open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
    </div>
  );
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  );
}
