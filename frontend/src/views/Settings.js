import React, { useEffect, useState } from 'react'
import { Card, CardTitle, CardSubtitle, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import axios from 'axios';
import config from "../config";
import useAuthentication from '../components/useAuthentication';

const Setting = () => {

    const [user, setUser] = useAuthentication()
    const [username, setUserName] = useState();
    const [currentPassword, setCurrentPassword] = useState(); //whats currently in db
    const [newPassword, setNewPassword] = useState();

    const getPassword = async () => {
        try {
            const passwordPromise = await axios.get(`${config.API_URL}/user-credential/${username}`);
            setCurrentPassword(await passwordPromise.data);
            console.log(await passwordPromise.data)
        }
        catch (e) {
            console.log(e);
        }
    }

    const NewPassword = async () => {
        try {
            await axios.post(`${config.API_URL}/user-credential/${username}/${newPassword}`,{
                headers: {'x-access-token': user,},
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <Card>
                    <CardTitle className='login-title' tag='span'>Khan Electronics</CardTitle>
                    <CardSubtitle className='login-subtitle'>Change Password</CardSubtitle>
                    <CardBody>
                        <Form inline>
                            <FormGroup floating>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Enter Username"
                                    type="text"
                                    onChange={e => setUserName(e.target.value)}
                                />
                                <Label for="username">
                                    Username
                                </Label>
                            </FormGroup>
                            <FormGroup floating>
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Enter new Password"
                                    type="password"
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                                <Label for="password">
                                    New Password
                                </Label>
                            </FormGroup>

                            <Button color='primary' onClick={NewPassword}>
                                Change Password
                            </Button>
                            
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )

}

export default Setting;