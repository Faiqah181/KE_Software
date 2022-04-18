import React, { useState } from 'react'
import { Card, CardTitle, CardSubtitle, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { useHistory } from "react-router-dom";
import useAuthentication from '../components/useAuthentication';
import '../css/Login.css'

const Login = () => {


    const history = useHistory();
    const [user, setUser] = useAuthentication();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');

    const submitCredentials = () => {
        if (username === "lallu" && password === "legend") {
            setUser({ name: "Lallu" })
            history.push("/Dashboard");
        }
        else setError("Invalid Credentials");
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
                            <Button color='primary' onClick={submitCredentials}>
                                Login
                            </Button>
                            {error && <div>{error}</div>}
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Login;

