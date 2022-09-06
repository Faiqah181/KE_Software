import React, { useState } from 'react'
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap'
import axios from 'axios';
import config from "../config";
import useAuthentication from '../components/useAuthentication';
import '../css/Settings.css';

const Setting = () => {

    const [user, setUser] = useAuthentication()
    const [username, setUserName] = useState();
    const [currentPassword, setCurrentPassword] = useState(); //whats currently in db
    const [newPassword, setNewPassword] = useState();
    const [confirmNewPassword, setConfirmedPassword] = useState();

    const [lastBackupDate, setLastBackupDate] = useState(" ");

    const NewPassword = async () => {
        try {
            if (JSON.stringify(confirmNewPassword) === JSON.stringify(newPassword)) {
                await axios.post(`${config.API_URL}/user-credential/${username}`, {
                    headers: { 'x-access-token': user, },
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            }

        }
        catch (e) {
            console.log(e);
        }
    }

    const backupData = async () => {
        try {
            const backupDate = await axios.post(`${config.API_URL}/backup`, {
                headers: { 'x-access-token': user, },
            })
            //setLastBackupDate(backupDate)

        } catch (error) {
            console.log(error)
        }
    }

    const restoreData = async () => {
        try {
            const backupDate = await axios.post(`${config.API_URL}/restore`, {
                headers: { 'x-access-token': user, },
            })
            //setLastBackupDate(backupDate)

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div>

            <h1>Settings</h1>
            <br />
            <Card>
                <CardBody>
                    <h5>Change Password</h5>
                    <p>To change your current password, you must enter your current password to authenticate the user.</p>
                    <div>
                        <Form>
                            <Row>
                                <Col>
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
                                </Col>
                                <Col>
                                    <FormGroup floating>
                                        <Input
                                            id="currentPassword"
                                            name="currentPassword"
                                            placeholder="Enter Current Password"
                                            type="password"
                                            onChange={e => setCurrentPassword(e.target.value)}
                                        />
                                        <Label for="password">
                                            Current Password
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup floating>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            placeholder="Enter new Password"
                                            type="password"
                                            onChange={e => setNewPassword(e.target.value)}
                                        />
                                        <Label for="password">
                                            New Password
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup floating>
                                        <Input
                                            id="newPasswordConfirm"
                                            name="newPasswordConfirm"
                                            placeholder="Re-enter your new Password to Confirm"
                                            type="password"
                                            onChange={e => setConfirmedPassword(e.target.value)}
                                        />
                                        <Label for="password">
                                            Confirm New Password
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button color='primary' onClick={NewPassword}>
                                Change Password
                            </Button>
                        </Form>
                    </div>
                </CardBody>
            </Card>
            <br />
            <Card>
                <CardBody>
                    <h5>BackUp and Restore</h5>
                    <p>Make sure to back up your data atleast every week so that if you system corrupts your data can be restored.</p>

                    <Label>Last back-up done: 14-09-2022 4:00pm</Label>
                    <p>{lastBackupDate}</p>
                    <Row>
                        <Col>
                            <Button color='primary' onClick={backupData}>Back Up</Button>
                            <Button className='restoreBtn' onClick={restoreData} color='secondary'>Restore</Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    )

}

export default Setting;