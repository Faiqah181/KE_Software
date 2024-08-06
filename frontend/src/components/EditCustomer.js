import axios from 'axios';
import React from 'react'
import { state } from "../store";
import useAuthentication from './useAuthentication';
import { Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input } from "reactstrap";

const EditCustomer = ({ editingCustomer, setModalOpen, refetchCustomers }) => {

    const [user] = useAuthentication();

    const saveCustomer = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const customer = Object.fromEntries(formData.entries());

        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/customers/${editingCustomer._id}`, customer, {
                headers: { 'x-access-token': user }
            });
    
            if (res.status === 200) {
                setModalOpen(null);
                refetchCustomers();
                state.alertState.message = "Customer saved successfully"
                state.alertState.color = "info"
                state.alertState.active = true
            }
        }
        catch (error) {
            console.log(error)
            state.alertState.message = "Error! Customer not saved."
            state.alertState.color = "danger"
            state.alertState.active = true
        }
    }

    return (
        <Modal isOpen={!!editingCustomer} centered toggle={() => { setModalOpen(null) }} size='lg' scrollable>
            <ModalHeader>Edit Customer</ModalHeader>
            <Form onSubmit={saveCustomer}>
                <ModalBody>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input id="name" defaultValue={editingCustomer?.name} name="name" placeholder="Enter customer name"></Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="fName">Father Name</Label>
                                <Input id="fName" defaultValue={editingCustomer?.fatherName} name="fatherName" placeholder="Enter customer's father name" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="mobNum">Mobile Number</Label>
                                <Input id="mobNum" defaultValue={editingCustomer?.mobile} name="mobile" placeholder="Enter customer's mobile number" />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="cnic">CNIC</Label>
                                <Input id="cnic" defaultValue={editingCustomer?.cnic} name="cnic" placeholder="Enter customer's CNIC" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="address">Address</Label>
                                <Input id="address" defaultValue={editingCustomer?.address} name="address" placeholder="Enter customer's address" type="textarea" />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => { setModalOpen(null) }}>Cancel</Button>
                    <Button color="primary" type="submit">Save Customer</Button>
                </ModalFooter>
            </Form>
        </Modal>
    )
}

export default EditCustomer