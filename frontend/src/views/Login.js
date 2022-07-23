import React, { useState } from 'react'
import { Card, CardTitle, CardSubtitle, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { useHistory } from "react-router-dom";
import useAuthentication from '../components/useAuthentication';
import '../css/Login.css'
import axios from 'axios';
import config from "../config";

const Login = () => {

    const history = useHistory();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');


    const [user, setUser] = useAuthentication();
    async function loginUser(event) {

        event.preventDefault()

        const res = await axios.post(`${config.API_URL}/login`, {
            "username": username,
            "password": password
        })

        const d = await res
        console.log(d.data.user)

        if (d.status === 200) {
            setUser(d.data.user);
            history.push("/Dashboard");
        }
        else {
            setUser(null)
            alert('Please check your username and password')
        }
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <Card>
                    <CardTitle className='login-title' tag='span'>Khan Electronics</CardTitle>
                    <CardSubtitle className='login-subtitle'>Log In</CardSubtitle>
                    <CardBody>
                        <Form inline>
                            <FormGroup floating>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Username"
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
                                    placeholder="Password"
                                    type="password"
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <Label for="password">
                                    Password
                                </Label>
                            </FormGroup>
                            <Button color='primary' onClick={loginUser}>
                                Login
                            </Button>

                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Login;

