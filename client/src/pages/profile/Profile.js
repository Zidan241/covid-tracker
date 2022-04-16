import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../authentication/store";
import { Paper, TextField, IconButton, Typography, Avatar, Button, CircularProgress, Divider } from '@mui/material';
import './styling/profile.scss';
import axios from 'axios';
import moment from 'moment';
import { link } from '../../helpers/constants';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";

export default function Profile(props) {
    let history = useHistory();
    const { user } = useContext(StoreContext);
    const [name, setName] = useState(user.name);
    const [data, setData] = useState(null);

    useEffect(() => {
        props.setLoading(true);
        axios.get(`${link}temp/getMyTemps`).then(res => {
            props.setLoading(false);
            setData(res.data.data);
        }).catch(err => {
            props.setLoading(false);
            const errorMsg = err.response?.data.error || "Something went wrong. Please try again.";
            props.handleError(errorMsg, "error");
        });
    }, [])

    const handleHistoryDelete = (tempId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonColor: '#60a7af',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                props.setLoading(true);
                axios.delete(`${link}temp/deleteTemp/${tempId}`).then(res => {
                    props.setLoading(false);
                    setData(prevState=>(prevState.filter(t=>t._id.toString()!=tempId.toString())))
                    props.handleError("record deleted successfully", "success");
                }).catch(err => {
                    props.setLoading(false);
                    const errorMsg = err.response?.data.error || "Something went wrong. Please try again.";
                    props.handleError(errorMsg, "error");
                });
            }
        })
    }

    const handleUserinfoUpdate = () => {
        if (!name) {
            props.handleError("please make sure to enter your name", "error");
        }
        props.setLoading(true);
        axios.patch(`${link}auth/updateInfo`, { name: name }).then(res => {
            props.setLoading(false);
            setName(res.data.data.name);
            props.handleError("name updated successfully", "success");
        }).catch(err => {
            props.setLoading(false);
            const errorMsg = err.response?.data.error || "Something went wrong. Please try again.";
            props.handleError(errorMsg, "error");
        });
    };

    return (
        <div className="profileContainer">
            <IconButton className="profileBackButton" onClick={() => { history.push('/dashboard') }}>
                <ArrowBackIcon className="icon" />
            </IconButton>
            <Paper elevation={4} className="profileUserinfoCard">
                <Avatar src={user.picture} className="profileUserinfoAvatar" />
                <div className="profileUserinfoHeadingContainer">
                    <Typography className="profileUserinfoHeading1">Stay</Typography>
                    <Typography className="profileUserinfoHeading2">Safe!</Typography>
                </div>
                <TextField
                    error={!name}
                    variant="outlined"
                    label="first name"
                    className="profileUserinfoField"
                    value={name}
                    onChange={(e) => { setName(e.target.value); }}
                    color="blue"
                />
                <Button color="blue" variant="contained" className="loginButton" onClick={handleUserinfoUpdate}>Save</Button>
            </Paper>
            <Paper elevation={4} className="profileUserHistoryContainer">
                <Typography className="profileUserHistoryTitle">History</Typography>
                {data ?
                    <div className="profileUserHistory">
                        {data.length > 0 ?
                            data.map(t => {
                                return (
                                    <Paper className="profileUserHistoryItem">
                                        <Typography className="profileUserHistoryItemTemp">{t.temp}°</Typography>
                                        <Divider orientation="vertical" flexItem />
                                        <Typography className="profileUserHistoryItemDate">{moment(t.creationDate).format("DD-MM-YYYY h:mm:ss a")}</Typography>
                                        <Divider orientation="vertical" flexItem />
                                        <IconButton onClick={()=>{handleHistoryDelete(t._id);}}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Paper>
                                );
                            })
                            :
                            <Typography className="profileUserHistoryEmpty">
                                no history recorded
                            </Typography>
                        }
                    </div>
                    :
                    <div className="progressContainer">
                        <CircularProgress color="blue" />
                    </div>
                }
            </Paper>
        </div>
    );
};
