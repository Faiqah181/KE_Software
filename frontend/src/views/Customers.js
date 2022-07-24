import React, { useState, useEffect } from "react";
import {
    Nav, NavItem, NavLink, Row, Col, TabPane, TabContent,
    Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input
} from "reactstrap";
import { state } from "../store";
import { useSnapshot } from "valtio";
import axios from "axios";
import config from "../config";
import { MDBDataTable } from "mdbreact";
import cloneDeep from 'lodash/cloneDeep';
import useAuthentication from "../components/useAuthentication";

const Customer = () => {

    var Name, fatherName, mobile, Cnic, Address
    const [user, setUser] = useAuthentication()

    const addCustomer = async () => {

        try {
            const promise = axios.post(`${config.API_URL}/customers`, {
                headers: {'x-access-token': user,},
                name: Name, mobile_num: mobile, cnic: Cnic, address: Address,
                status: "current", wallet: 0, father_name: fatherName
            })
        }
        catch (error) {
            console.log(error)
        }

        finally {
            setModalOpen(false)
        }

    }

    const inputData = (event) => {

        const target = event.target

        if (target.id === "Cname") { Name = target.value }
        else if (target.id === "C_fName") { fatherName = target.value }
        else if (target.id === "C_mobNum") { mobile = target.value }
        else if (target.id === "C_cnic") { Cnic = target.value }
        else if (target.id === "C_address") { Address = target.value }

    }

    const customersData = {
        columns: [
            {
                label: 'Name',
                field: 'name',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Mobile Num',
                field: 'mobile_num',
                sort: 'asc',
                width: 50
            },
            {
                label: 'Address',
                field: 'address',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Status',
                field: 'status',
                sort: 'asc',
                width: 150
            },
            {
                label: 'CNIC',
                field: 'cnic',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Wallet',
                field: 'wallet',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Father Name',
                field: 'father_name',
                sort: 'asc',
                width: 150
            }
        ]
    }

    const [customerData, setCustomerData] = useState(customersData)
    const [tab, setTab] = useState("1");
    const [isModalOpen, setModalOpen] = useState(false)


    const getCustomers = async () => {
        try {
            axios.get(`${config.API_URL}/customers`, {
                headers: {'x-access-token': user,},
            }).then(response => {
                setCustomerData(oldData => { let newData = cloneDeep(oldData); newData.rows = response.data; return newData })
            });

        }

        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCustomers();
    }, [])


    return (
        <div>
            <h1>Customers</h1>

            <Row>
                <Col>
                    <Button id="addCustomerBtn" color="primary" onClick={() => { setModalOpen(!isModalOpen) }}>Add Customer </Button>
                </Col>
            </Row>

            <Modal isOpen={isModalOpen} toggle={() => { setModalOpen(!isModalOpen) }} size='lg' scrollable>
                <ModalHeader>Add New Customers</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="Cname">Name</Label>
                                    <Input id="Cname" name="Customer" onChange={inputData} placeholder="Enter customer name"></Input>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="C_fName">Father Name</Label>
                                    <Input id="C_fName" name="Customer Father Name" onChange={inputData} placeholder="Enter customer's father name"></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="C_mobNum">Mobile Number</Label>
                                    <Input id="C_mobNum" onChange={inputData} placeholder="Enter customer's mobile number" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="C_cnic">CNIC</Label>
                                    <Input id="C_cnic" onChange={inputData} placeholder="Enter customer's CNIC" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="C_address">Address</Label>
                                    <Input id="C_address" onChange={inputData} placeholder="Enter customer's address" type="textarea" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => { setModalOpen(false) }}>Cancel</Button>
                    <Button color="primary" onClick={addCustomer}>Add Customer</Button>
                </ModalFooter>
            </Modal>

            <Nav tabs>
                <NavItem>
                    <NavLink className={tab === "1" && "active"} onClick={() => { setTab("1") }}>
                        Current Customers
                    </NavLink>
                </NavItem>
                {/*<NavItem>
                    <NavLink className={tab === "2" && "active"} onClick={() => { setTab("2") }}>
                        Defaulters
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={tab === "3" && "active"} onClick={() => { setTab("3") }}>
                        Former Customers
                    </NavLink>
                </NavItem>*/}
            </Nav>
            <TabContent activeTab={tab}>
                <TabPane tabId="1">
                    <MDBDataTable data={customerData} searching sortable >
                    </MDBDataTable>
                </TabPane>
                {/*<TabPane tabId="2">

                </TabPane>
                <TabPane tabId="3">

                </TabPane>*/}
            </TabContent>

        </div>
    );
};

export default Customer;