import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, Typography, DialogTitle, DialogContentText, TextField, Button, Slider, Grid } from '@mui/material';
import '../styling/form.scss';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import axios from 'axios';
import { link } from '../../../helpers/constants';

export default function InputTempForm(props) {
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [temp, setTemp] = useState(37);
    const [comment, setComment] = useState("");

    const lowTemp = 30;
    const highTemp = 45;

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                //str = "Lat: " + pos.coords.latitude + "Long: " + pos.coords.longitude; 
                setLat(pos.coords.latitude);
                setLong(pos.coords.longitude);
            });
        } else {
            props.handleError("Geolocation is not supported by this browser.", "error");
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
            props.handleError("lowest possible temperature is " + lowTemp + " degrees celsius", "warning");
            setTemp(lowTemp);
        } else if (temp > highTemp) {
            props.handleError("highest possible temperature is " + highTemp + " degrees celsius", "warning");
            setTemp(highTemp);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const handleSubmit = async () => {
        if (!lat || !long) {
            return props.handleError("could get your current location, please check your browser", "error");
        }
        if (!temp) {
            return props.handleError("please make sure you have entered a valid temperature", "error");
        }
        props.setLoading(true);
        axios.post(`${link}temp/submitTemp`, { long: long, lat: lat, temp: temp , comment: comment}).then(res => {
            props.setLoading(false);
            props.handleError("Temperature log created successfully, Stay Safe!","success");
            props.setData(prevState=>([...prevState,res.data.data]))
            //reset component
            setComment("");
            setTemp(37);
            props.handleClose();
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
                    <DialogContentText className="formTextField">
                        log your information on the map frequently and Stay Safe!
                    </DialogContentText>
                    <div>
                        <TextField
                            label="long"
                            className="formlongField"
                            value={long ? long : "-"}
                            disabled={!long}
                            margin="normal"
                            onChange={(e)=>{setLong(e.target.value);}}
                        />
                        <TextField
                            label="lat"
                            margin="normal"
                            className="formlatField"
                            value={lat ? lat : "-"}
                            disabled={!lat}
                            onChange={(e)=>{setLat(e.target.value);}}
                        />
                    </div>
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
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        color="blue"
                        className="formTextField"
                        label="comments"
                        value={comment}
                        onChange={(e)=>{setComment(e.target.value);}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button className="formButton" color="secondary" variant="outlined" onClick={props.handleClose}>Cancel</Button>
                    <Button className="formButton" color="blue" variant="contained" onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
