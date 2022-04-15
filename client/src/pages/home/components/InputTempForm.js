import React, {useState , useEffect} from "react";
import {Dialog,DialogActions,DialogContent,Typography,DialogTitle,DialogContentText,TextField,Button,Slider,Grid} from '@mui/material';
import '../styling/form.scss';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import axios from 'axios';
import { link } from '../../../helpers/constants';
import {getToken} from '../../../authentication/services'
import setToken from "../../../helpers/setToken";

export default function InputTempForm (props) {
    const [loc,setLoc] = useState(null);
    const [temp,setTemp] = useState(37);

    const lowTemp = 30;
    const highTemp = 45;

    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos)=>{
            //str = "Lat: " + pos.coords.latitude + "Long: " + pos.coords.longitude; 
            setLoc(pos)
          });
        } else {
            props.handleError("Geolocation is not supported by this browser.","error");
        }
    };

    const handleSliderChange = (event, newValue) => {
        setTemp(newValue);
    };
    
    const handleInputChange = (event) => {
        setTemp(event.target.value === '' ? '' : Number(event.target.value));
    };
    
    const handleBlur = () => {
        if (temp < lowTemp) {
            props.handleError("lowest possible temperature is " + lowTemp + " degrees celsius","warning");
            setTemp(lowTemp);
        } else if (temp > highTemp) {
            props.handleError("highest possible temperature is " + highTemp + " degrees celsius","warning");
            setTemp(highTemp);
        }
    };

    useEffect(()=>{
        getLocation();
    },[]);

    const handleSubmit = async () => {
        if(!loc){
            return props.handleError("could get your current location, please check your browser","error");
        }
        if(!temp){
            return props.handleError("please make sure you have entered a valid temperature","error");
        }
        props.setLoading(true);
        axios.post(`${link}temp/submitTemp`,{long:loc.coords.longitude,lat:loc.coords.latitude,temp:temp}).then(res => {
            props.setLoading(false);

        }).catch(err => {
            props.setLoading(false);
            const errorMsg = err.response?.data.error || "Something went wrong. Please try again.";
            props.handleError(errorMsg, "error");
        });
    };

    return (
        <div className="formContainer">
            <Dialog className="dialogContainer" open={props.open} onClose={props.andleClose}>
                <DialogTitle className="formTitle" >
                    Input Information Form
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        
                    </DialogContentText>
                    <div>
                        <TextField
                            label="lat"
                            margin="normal"
                            className="formTextField"
                            value={loc?loc.coords.latitude:"-"}
                            disabled={true}
                        />
                        <TextField
                            label="long"
                            margin="normal"
                            className="formTextField"
                            value={loc?loc.coords.longitude:"-"}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <div className="tempInputContainer">
                            <ThermostatIcon />
                            <Slider
                                className="tempSlider"
                                min={lowTemp}
                                max={highTemp}
                                step={1}
                                valueLabelDisplay="auto"
                                marks
                                color="blue"
                                value={temp}
                                onChange={handleSliderChange}
                                aria-labelledby="temp-slider"
                            />
                            <TextField
                                className="tempField"
                                color="blue"
                                value={temp}
                                size="small"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 1,
                                    min: lowTemp,
                                    max: highTemp,
                                    type: 'number',
                                    'aria-labelledby': 'temp-slider',
                                }}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" variant="outlined" onClick={props.handleClose}>Cancel</Button>
                    <Button color="blue" variant="contained" onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
