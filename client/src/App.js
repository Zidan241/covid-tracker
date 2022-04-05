import React, { useState } from "react";
import {
  Switch,
  Route
} from "react-router-dom";
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Register from "./pages/login/Register";
import Authorize from "./pages/login/Authorize";
import { SnackbarProvider, useSnackbar } from 'notistack';
import './styling/app.scss';
import {CircularProgress,Backdrop} from '@mui/material';
import ProctectedRoute from "./ProtectedRoute";

function App() {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (message,variant) => {
    enqueueSnackbar(message,{variant});
  };

  return (
    <div className="app">
        <Switch>
          <Route path="/authorize" render={(prop) => <Authorize {...prop} setLoading={setLoading}/>}/>
          <Route path="/login" render={(prop) => <Login {...prop} setLoading={setLoading} handleError={handleClick}/>}/>
          <Route path="/register" render={(prop) => <Register {...prop} setLoading={setLoading} handleError={handleClick}/>}/>
          <ProctectedRoute path="/dashboard" render={(prop) => <Home {...prop} setLoading={setLoading} handleError={handleClick}/>}/>
        </Switch>
        <Backdrop
        sx={{ color: '#fff', zIndex: 1 }}
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
