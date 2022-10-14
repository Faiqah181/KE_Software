import React, { useEffect, useState } from 'react'
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Row, Col, Modal, ModalHeader, ModalBody, Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap'
import LoadingButton from '../components/LoadingButton'
import useAuthentication from '../components/useAuthentication';
import axios from 'axios';
import config from "../config";
import '../css/Settings.css';
import { state } from '../store';

const Setting = () => {

    const today = new Date().toISOString().slice(0, 10);

    const [user] = useAuthentication()
    const [username, setUserName] = useState();
    const [currentPassword, setCurrentPassword] = useState(); //whats currently in db
    const [newPassword, setNewPassword] = useState();
    const [confirmNewPassword, setConfirmedPassword] = useState();

    const [backupModal, showBackupModal] = useState(false);
    const [newBackupName, setNewBackupName] = useState('');
    const [backupLoader, setBackupLoader] = useState(false);
    const [lastBackupDate, setLastBackupDate] = useState(" ");

    const [backupList, setBackupList] = useState([]);
    const [restoreModal, showRestoreModal] = useState(false);
    const [restoreLoader, setRestoreLoader] = useState(false);
    const [olderBackupsOpen, showOlderBackups] = useState(false);


    const NewPassword = async () => {
        try {
            if (JSON.stringify(confirmNewPassword) === JSON.stringify(newPassword)) {
                const passPromise = await axios.post(`${config.API_URL}/update-user-credential`, {
                    headers: { 'x-access-token': user, },
                    userName: username,
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
                if (passPromise.status === 200) {
                    state.alertState.active = true
                    state.alertState.message = "Password changed successfully"
                    state.alertState.color = "info"
                    setCurrentPassword("")
                    setUserName("")
                    setNewPassword("")
                    setConfirmedPassword("")
                }
                else {
                    state.alertState.active = true
                    state.alertState.message = "Invalid current password!"
                    state.alertState.color = "danger"
                    setCurrentPassword("")
                    setUserName("")
                    setNewPassword("")
                    setConfirmedPassword("")
                }
            }

        }
        catch (e) {
            console.log(e);
        }
    }

    const openBackupSettings = () => {
        setNewBackupName(today);
        showBackupModal(true)
    }

    const getCurrentBackups = async () => {
        const backups = await axios.get(`${config.API_URL}/backups`, {
            headers: { 'x-access-token': user, },
        });
        setBackupList(backups.data);
    }

    const backupData = async () => {
        try {
            setBackupLoader(true);
            await axios.post(`${config.API_URL}/backup`, { backupName: newBackupName }, {
                headers: { 'x-access-token': user, },
            });

            getCurrentBackups();
            showBackupModal(false);
        } catch (error) {
            console.log(error)
        }
        finally { setBackupLoader(false); }
    }

    const restoreData = async (backupName) => {
        try {
            setRestoreLoader(backupName);
            await axios.post(`${config.API_URL}/restore`, { backupName }, {
                headers: { 'x-access-token': user, },
            })

            showRestoreModal(false);
        } catch (error) {
            console.log(error)
        }
        finally { setRestoreLoader(false); }
    }

    useEffect(() => {
        getCurrentBackups();
    }, [])

    useEffect(() => {
        setLastBackupDate(backupList[0]);
    }, [backupList])

    const OldBackupRow = (props) => {
        return (
            <div className='backup-list-row'>
                <div>{props.name}</div>
                <LoadingButton disabled={props.disabled} isLoading={props.isLoading} onClick={props.onClick}>Restore</LoadingButton>
            </div>
        )
    }

    return (
        <div>

            <h2>Settings</h2>
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
                                            value={username}
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
                                            value={currentPassword}
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
                                            value={newPassword}
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
                                            value={confirmNewPassword}
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

                    <Label><span style={{ fontWeight: 500 }}>Last Backup:</span> {lastBackupDate}</Label>
                    <Row>
                        <Col>
                            <Button color='primary' onClick={openBackupSettings}>Backup</Button>
                            <Button className='restoreBtn' onClick={() => showRestoreModal(true)} color='secondary'>Restore</Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Modal isOpen={backupModal} centered toggle={() => { showBackupModal(!backupModal) }}>
                <ModalHeader>Backup Your Data</ModalHeader>
                <ModalBody>
                    <p style={{ marginBottom: "2rem" }}><i>Any backup with duplicate name will be overwrited.</i></p>
                    <FormGroup row style={{ alignItems: "center" }}>
                        <Col sm={3}>
                            <span>Backup Name</span>
                        </Col>
                        <Col sm={5}>
                            <Input value={newBackupName} onChange={(e) => { setNewBackupName(e.target.value) }} disabled />
                        </Col>
                        <Col sm={4} style={{ display: "flex", justifyContent: "center" }}>
                            <LoadingButton color="primary" onClick={backupData} isLoading={backupLoader}>
                                Confirm
                            </LoadingButton>
                        </Col>
                    </FormGroup>
                </ModalBody>

            </Modal>

            <Modal isOpen={restoreModal} centered toggle={() => { showRestoreModal(!restoreModal) }}>
                <ModalHeader>Restore Your Data</ModalHeader>
                <ModalBody>
                    <p style={{ marginBottom: "2rem" }}><i>Caution! Current data will be deleted and data from backup will be restored.  </i></p>
                    <FormGroup row style={{ alignItems: "center" }}>
                        <Col sm={3}>
                            <span>Latest Backup</span>
                        </Col>
                        <Col sm={5}>
                            <Input value={backupList[0]} disabled />
                        </Col>
                        <Col sm={4} style={{ display: "flex", justifyContent: "center" }}>
                            <LoadingButton color="primary" onClick={() => restoreData(backupList[0])} isLoading={restoreLoader === backupList[0]} disabled={restoreLoader && restoreLoader !== backupList[0]}>
                                Confirm
                            </LoadingButton>
                        </Col>
                    </FormGroup>

                    <Accordion open={olderBackupsOpen} toggle={() => showOlderBackups(olderBackupsOpen ? false : '1')}>
                        <AccordionItem>
                            <AccordionHeader targetId='1'>Show older backups</AccordionHeader>
                            <AccordionBody accordionId='1'>
                                {backupList.slice(1).map(backup =>
                                    <OldBackupRow 
                                        key={backup} 
                                        name={backup} 
                                        onClick={() => restoreData(backup)} 
                                        isLoading={restoreLoader === backup} 
                                        disabled={restoreLoader && restoreLoader !== backup}
                                    />
                                )}
                            </AccordionBody>
                        </AccordionItem>
                    </Accordion>
                </ModalBody>

            </Modal>
        </div>
    )

}

export default Setting;