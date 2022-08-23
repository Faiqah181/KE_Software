import React, { useState, useRef, useEffect } from "react";
import {
    Nav, NavItem, NavLink, Row, Col, TabPane, TabContent, Card, CardBody,
    Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input
} from "reactstrap";
import axios from "axios";
import config from "../config";
import useAuthentication from "../components/useAuthentication";
import CustomTable from "../components/CustomTable";
import { Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";

const Customer = () => {

    const [user] = useAuthentication();
    const newCustomer = useRef({});

    const [search, setSearch] = useState('');
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const [defaulters, setDefaulters] = useState([]);
    const [filteredDefaulters, setFilteredDefaulters] = useState([]);

    const [formers, setFormers] = useState([]);
    const [filteredFormers, setFilteredFormers] = useState([]);
    const [activeTab, setActiveTab] = useState("1");
    const [isModalOpen, setModalOpen] = useState(false)


    const addCustomer = async (e) => {
        e.preventDefault();

        try {
            newCustomer.current.status = "current";
            newCustomer.current.wallet = 0;

            const res = await axios.post(`${config.API_URL}/customers/add`, newCustomer.current, {
                headers: { 'x-access-token': user }
            })

            if (res.status === 200) {
                setCustomers(state => { state.push(res.data); return state; })
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            newCustomer.current = {};
            setModalOpen(false)
        }
    }

    const inputData = (event) => {
        const target = event.target

        if (target.id === "Cname") { newCustomer.current.name = target.value }
        else if (target.id === "C_fName") { newCustomer.current.fatherName = target.value }
        else if (target.id === "C_mobNum") { newCustomer.current.mobile = target.value }
        else if (target.id === "C_cnic") { newCustomer.current.cnic = target.value }
        else if (target.id === "C_address") { newCustomer.current.address = target.value }
    }

    const searchChanged = (e, tab) => {
        if (e) {
            setSearch(e.target.value.trim().toLowerCase());
        }

        const searchText = e ? e.target.value.trim().toLowerCase() : search;

        if (tab === "1") {
            setFilteredCustomers(searchText ?
                customers.filter(c =>
                    c.name.toLowerCase().includes(searchText) || c.address.toLowerCase().includes(searchText)
                ) : customers
            );
        }
        else if (tab === "2") {
            setFilteredDefaulters(searchText ?
                defaulters.filter(c =>
                    c.name.toLowerCase().includes(searchText) || c.address.toLowerCase().includes(searchText)
                ) : defaulters
            );
        }
        else if (tab === "3") {
            setFilteredFormers(searchText ?
                defaulters.filter(c =>
                    c.name.toLowerCase().includes(searchText) || c.address.toLowerCase().includes(searchText)
                ) : formers
            );
        }
    }


    useEffect(() => {

        const getCustomers = async () => {
            try {
                const currentPromise = axios.get(`${config.API_URL}/customers/type/current`, {
                    headers: { 'x-access-token': user }
                });
                const defaulterPromise = axios.get(`${config.API_URL}/customers/type/defaulter`, {
                    headers: { 'x-access-token': user }
                });
                const formerPromise = axios.get(`${config.API_URL}/customers/type/former`, {
                    headers: { 'x-access-token': user }
                });

                const res = await Promise.all([currentPromise, defaulterPromise, formerPromise]);

                setCustomers(res[0].data);
                setDefaulters(res[1].data);
                setFormers(res[2].data);
            }
            catch (error) {
                console.log(error);
            }
        }

        getCustomers();
    }, [])

    useEffect(() => {
        searchChanged(null, "1");
    }, [customers])

    useEffect(() => {
        searchChanged(null, "2");
    }, [defaulters])
    
    useEffect(() => {
        searchChanged(null, "3");
    }, [formers])

    return (
        <Card>
            <CardBody>
                <h2>Customers</h2>

                <div style={{ display: "flow-root" }}>
                    <Button style={{ float: "right" }} id="addCustomerBtn" color="primary" onClick={() => { setModalOpen(!isModalOpen) }}>Add Customer </Button>
                </div>

                <Nav tabs>
                    <NavItem>
                        <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => setActiveTab("1")}>
                            Current Customers
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => setActiveTab("2")}>
                            Defaulters
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => setActiveTab("3")}>
                            Former Customers
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <CustomTable searchable isEmpty={!customers.length} searchEvent={(e) => searchChanged(e, "1")}>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Mobile No</Th>
                                    <Th>Address</Th>
                                    <Th>CNIC</Th>
                                    <Th>Wallet</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredCustomers.map(c => {
                                    return (
                                        <Tr key={c._id}>
                                            <Td>{c.name}</Td>
                                            <Td>{c.mobile}</Td>
                                            <Td>{c.address}</Td>
                                            <Td>{c.cnic}</Td>
                                            <Td>{c.wallet}</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </CustomTable>
                    </TabPane>
                    <TabPane tabId="2">
                        <CustomTable searchable isEmpty={!defaulters.length} searchEvent={(e) => searchChanged(e, "2")}>
                            <Thead>
                                <Tr>
                                    <Td>Name</Td>
                                    <Td>Mobile No</Td>
                                    <Td>Address</Td>
                                    <Td>CNIC</Td>
                                    <Td>Wallet</Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredDefaulters.map(c => {
                                    return (
                                        <Tr key={c._id}>
                                            <Td>{c.name}</Td>
                                            <Td>{c.mobile}</Td>
                                            <Td>{c.address}</Td>
                                            <Td>{c.cnic}</Td>
                                            <Td>{c.wallet}</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </CustomTable>
                    </TabPane>
                    <TabPane tabId="3">
                        <CustomTable searchable isEmpty={!formers.length} searchEvent={(e) => searchChanged(e, "3")}>
                            <Thead>
                                <Tr>
                                    <Td>Name</Td>
                                    <Td>Mobile No</Td>
                                    <Td>Address</Td>
                                    <Td>CNIC</Td>
                                    <Td>Wallet</Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredFormers.map(c => {
                                    return (
                                        <Tr key={c._id}>
                                            <Td>{c.name}</Td>
                                            <Td>{c.mobile}</Td>
                                            <Td>{c.address}</Td>
                                            <Td>{c.cnic}</Td>
                                            <Td>{c.wallet}</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </CustomTable>
                    </TabPane>
                </TabContent>

                <Modal isOpen={isModalOpen} centered toggle={() => { setModalOpen(!isModalOpen) }} size='lg' scrollable>
                    <ModalHeader>Add New Customers</ModalHeader>
                    <Form onSubmit={addCustomer}>
                        <ModalBody>
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
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={() => { setModalOpen(false) }}>Cancel</Button>
                            <Button color="primary" type="submit">Add Customer</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </CardBody>
        </Card>
    );
};

export default Customer;