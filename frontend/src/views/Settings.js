import React, { useState } from 'react'
import { Card, CardTitle, CardSubtitle, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import axios from 'axios';
import config from "../config";

const Setting = () => {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState(); //for temporary setting what the user enter
    const [currentPassword, setCurrentPassword] = useState(); //whats currently in db
    const [newPassword, setNewPassword] = useState();
    const [error, setError] = useState('');

    const getPassword = async () => {
        try {
            const customerPromise = await axios.get(`${config.API_URL}/user-credential/${username}`);
            setCurrentPassword(await customerPromise.data);
        }
        catch (e) {
            console.log(e);
        }
    }

    const NewPassword = async () => {
        try {
            await axios.post(`${config.API_URL}/user-credential/${username}/${newPassword}`)
        }
        catch (e) {
            console.log(e);
        }
    }

    const Authenticate = async () => {
        await getPassword();

        console.log(username)
        console.log(password)
        console.log(currentPassword)
        
        if(currentPassword === password){
            NewPassword();
        }
        else{
            setError("Cannot change password, Invalid Credentials");
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
                                    id="oldpassword"
                                    name="oldpassword"
                                    placeholder="Enter current Password"
                                    type="password"
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <Label for="oldpassword">
                                    Current Password
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
                            <Button color='primary' onClick={Authenticate}>
                                Change Password
                            </Button>
                            {error && <div>{error}</div>}
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )

}

export default Setting;