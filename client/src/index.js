import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from "./authentication/store";
import { createMuiTheme , ThemeProvider} from '@material-ui/core/styles';
import 'mapbox-gl/dist/mapbox-gl.css';
import './helpers/axios';

const theme = createMuiTheme({
  palette: {
    blue: {
      main: '#60a7af',
      contrastText: '#ffffff'
    }
  }
});
ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
        <Router>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Router>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
