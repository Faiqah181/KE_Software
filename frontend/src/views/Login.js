import React, { useState } from 'react'
import { Card, CardTitle, CardSubtitle, CardBody, Form, FormGroup, Label, Input, Button, Spinner, FormFeedback } from 'reactstrap'
import { useHistory } from "react-router-dom";
import useAuthentication from '../components/useAuthentication';
import '../css/Login.css'
import axios from 'axios';
import config from "../config";

const Login = () => {

    const history = useHistory();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [error, setError] = useState('');

    const [user, setUser] = useAuthentication();
    
    const loginUser = async (e) => {
        e.preventDefault();
        setInvalid(false);

        if(password == ''){
            setError('Enter a password');
            setInvalid(true);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${config.API_URL}/login`, {
                "username": username,
                "password": password
            })

            if (res.status === 200) {
                setUser(res.data);
                history.push("/Dashboard");
            }
        }
        catch (err) {
            setUser(null)
            setError(err.response?.status === 401 ? 
                'Wrong password. Try again or click Forgot password to reset it.' : 
                'Unable to reach server at the moment. '
            );
            setInvalid(true);
            setPassword('');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <Card body>
                    <CardTitle className='login-title' tag='span'>Khan Electronics</CardTitle>
                    <CardSubtitle className='login-subtitle'>Log In</CardSubtitle>
                    <CardBody>
                        <Form onSubmit={loginUser}>
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
                                    value={password}
                                    placeholder="Password"
                                    type="password"
                                    invalid={invalid}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <Label for="password">
                                    Password
                                </Label>
                                <FormFeedback>{error}</FormFeedback>
                            </FormGroup>
                            <Button color='primary' type='submit'>
                                <span>Login</span>
                                <span className={`button-spinner ${loading ? 'loading' : ''}`}>
                                    <Spinner size='sm' />
                                </span>
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Login;

