import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState, useRef } from "react";
import cloneDeep from 'lodash/cloneDeep';
import axios from "axios";
import config from "../config";
import Select from 'react-select';
import { Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input } from "reactstrap";

const Account = () => {

    const accountData = {
        columns : [
            {
                label: 'Account Number',
                field: 'account_num',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Customer Name',
                field:'customer_id',
                sort:'asc',
                width:150
            },
            {
                label: 'Item Name',
                field:'item',
                sort:'asc',
                width:150
            },
            {
                label: 'Balance',
                field:'balance',
                sort:'asc',
                width:150
            }
        ]
    }

    const [accounts, setAccounts] = useState(accountData)
    const [isModalOpen, setModalOpen] = useState(false)

    const getAccounts = async () => {

        try {
            axios.get(`${config.API_URL}/accounts`).then(response => {
                setAccounts(oldData => { let newData = cloneDeep(oldData); newData.rows = response.data; return newData })
            });
        }
        catch (error) {
            console.log(error)
        }

    }

    const account = useRef({})

    useEffect(() => {
        getAccounts();
        getCustomers();
    }, [])

    const addAccount = async () => {
        try {
            account.current.customer_id = selectedCustomer.value
            account.current.discount = 0
            account.current.closed = false
            account.current.date_of_sale = new Date().toLocaleDateString()
            console.log(account)
            const promise = axios.post(`${config.API_URL}/accounts`, account.current)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setModalOpen(false)
        }

    }

    const [customerData, setCustomerData] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customersList, setCustomersList] = useState([])

    const getCustomers = async () => {
        try {

            const customerPromise = await axios.get(`${config.API_URL}/customers`);
            setCustomerData(await customerPromise.data);
        }

        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setCustomersList(customerData.map(c => ({
            value: c._id, label: c.name
        })))
    }, [customerData])

    return (

        <div>
            <h1>Accounts</h1>
            <Row>
                <Col>
                    <Button id="addAccountBtn" color="primary" onClick={() => { setModalOpen(!isModalOpen) }}>Add Account</Button>
                </Col>
            </Row>

            <Modal isOpen={isModalOpen} toggle={() => { setModalOpen(!isModalOpen) }} size='lg' scrollable>
                <ModalHeader>Add New Account</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="A_number">Account Number</Label>
                                    <Input id="A_number" name="Account Number" onChange={(evt)=>{account.current.account_num = evt.target.value}} placeholder="Enter Account Number"></Input>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_Customer">Customer</Label>
                                    <Select id="A_Customer" isSearchable isClearable onChange={setSelectedCustomer}
                                    options={customersList} placeholder="Select Customer" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_item">Item</Label>
                                    <Input id="A_item" name="Item" onChange={(evt)=>{account.current.item = evt.target.value}} placeholder="Enter item name"></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="A_originalCost">Original Cost</Label>
                                    <Input id="A_originalCost" type="number" onChange={(evt)=>{account.current.cost = evt.target.value}} placeholder="Enter Cost of Item" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_retailPrice">Retail Price</Label>
                                    <Input id="A_retailPrice" onChange={(evt)=>{account.current.retail_price = evt.target.value}} placeholder="Enter retail price of item" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_installmentPrice">Installment Price</Label>
                                    <Input id="A_installmentPrice" onChange={(evt)=>{account.current.installment_price = evt.target.value}} placeholder="Enter installment price" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="A_advance">Advance Amount</Label>
                                    <Input id="A_advance" onChange={(evt)=>{account.current.advance = evt.target.value}} placeholder="Enter Advance amount" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_balance">Balance Amount</Label>
                                    <Input id="A_balance" onChange={(evt)=>{account.current.balance = evt.target.value}} placeholder="Enter Balance amount" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => { setModalOpen(false) }}>Cancel</Button>
                    <Button color="primary" onClick={addAccount} >Add Account</Button>
                </ModalFooter>
            </Modal>
            <MDBDataTable searching sortable data={accounts} />
        </div>
    );

};

export default Account;