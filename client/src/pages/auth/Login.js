import React, { useState } from "react";
import {Button,TextField,Paper, Typography} from '@mui/material';
import './styling/login.scss';
import ReactCodeInput from 'react-verification-code-input';
import {validateEmail} from '../../validation/helpers';
import { otpStart, otpLogin } from "../../authentication/services";
import axios from 'axios';
import { link } from '../../helpers/constants';
import { useHistory } from "react-router-dom";

export default function Login(props) {
    let history = useHistory();
    const [email, setEmail] = useState(null);
    const [click, setClick] = useState(null);
    const [otp, setOtp] = useState(false);

    const requestOtp = async () => {
        setClick(true);
        if(!email || !validateEmail(email)) 
            props.handleError("please enter a valid email address", "error");
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
        axios.get(`${link}auth/registerCheck/${email}`).then(res => {
            if(!res.data.data) return props.handleError("this email is not registered, please register first", "error");
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
            await otpLogin(email,code);
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
                    <Button color="blue" variant="text" className="loginButton" onClick={resend}>did not recieve the code?</Button>
                </React.Fragment>
                :
                <React.Fragment>
                    <TextField
                    error={click && (!email||!validateEmail(email))}
                    type="email" 
                    variant="outlined" 
                    label="email" 
                    className="loginField" 
                    onChange={(e)=>{setEmail(e.target.value);}}
                    color="blue"
                    />
                    <Button color="blue" variant="contained" className="loginButton" onClick={requestOtp}>Login</Button>
                    <Button color="blue" variant="text" className="goToButton" onClick={()=>{history.push('/register')}}>new user?</Button>
                </React.Fragment>
                }
            </Paper>
        </div>
    );
}
// credits --> https://github.com/krizten/passwordless-auth