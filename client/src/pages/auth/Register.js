import React, { useState } from "react";
import {Button,TextField,Paper, Typography} from '@mui/material';
import './styling/login.scss';
import ReactCodeInput from 'react-verification-code-input';
import {validateEmail} from '../../validation/helpers';
import { otpStart, otpLogin } from "../../authentication/services";
import axios from 'axios';
import { link } from '../../helpers/constants';
import { useHistory } from "react-router-dom";

export default function Register(props) {
    let history = useHistory();
    const [email, setEmail] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [click, setClick] = useState(null);
    const [otp, setOtp] = useState(false);

    const requestOtp = async () => {
        setClick(true);
        if(!email || !validateEmail(email)) 
            props.handleError("please enter a valid email address", "error");
        if(!firstname)
            props.handleError("please enter your first name", "error");
        if(!lastname)
            props.handleError("please enter your last name", "error");
        const doReq = async () => {
            try {
                props.setLoading(true);
                await otpStart(email);
                props.setLoading(false);
                setOtp(true);
                props.handleError(`OTP Code has been sent to ${email}`, "success");
            } catch (err) {
                props.setLoading(false);
                const errorMsg = err.response?.data.error || "Something went wrong. Please try again.";
                props.handleError(errorMsg, "error");
            }
        }
        axios.post(`${link}auth/register`, {email:email,name:(firstname+" "+lastname)}).then(res => {
            doReq();
        }).catch(err => {
            props.setLoading(false);
            const errorMsg = err.response?.data.error || "Something went wrong. Please try again.";
            props.handleError(errorMsg, "error");
        });
    };
    const verify = async (code) => {
        try {
            props.setLoading(true);
            await otpLogin(email,code, (firstname+" "+lastname) );
            props.setLoading(false);
        } catch (err) {
            props.setLoading(false);
            console.log(err);
            const errorMsg = err?.error || "Something went wrong. Please try again.";
            props.handleError(errorMsg, "error");
        }
    };
    const resend = () => {
        setOtp(false);
        setClick(false);
    };
    return (
        <div className="loginContainer">
            <Paper elevation={4} className="loginCard">
                <div className="loginHeadingContainer">
                    <Typography className="loginHeading1">Stay</Typography>
                    <Typography className="loginHeading2">Safe!</Typography>
                </div>
                {otp?
                <React.Fragment>
                    <ReactCodeInput className="loginField" onComplete={(code)=>{verify(code)}}/>
                    <Button variant="text" color="blue" className="loginButton" onClick={resend}>did not recieve the code?</Button>
                </React.Fragment>
                :
                <React.Fragment>
                    <div className="nameFieldsContainer">
                        <TextField
                        error={click && (!firstname)}
                        variant="outlined" 
                        label="first name" 
                        className="nameField" 
                        onChange={(e)=>{setFirstname(e.target.value);}}
                        color="blue"
                        />
                        <TextField
                        error={click && (!lastname)}
                        type="email" 
                        variant="outlined" 
                        label="last name" 
                        className="nameField" 
                        onChange={(e)=>{setLastname(e.target.value);}}
                        color="blue"
                        />
                    </div>
                    <TextField
                    error={click && (!email||!validateEmail(email))}
                    type="email" 
                    variant="outlined" 
                    label="email" 
                    className="loginField" 
                    onChange={(e)=>{setEmail(e.target.value);}}
                    color="blue"
                    />
                    <Button color="blue" variant="contained" className="loginButton" onClick={requestOtp}>Register</Button>
                    <Button color="blue" variant="text" className="goToButton" onClick={()=>{history.push('/login')}}>already a user?</Button>
                </React.Fragment>
                }
            </Paper>
        </div>
    );
}
// credits --> https://github.com/krizten/passwordless-auth