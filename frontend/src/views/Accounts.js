import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState, useRef } from "react";
import cloneDeep from 'lodash/cloneDeep';
import axios from "axios";
import config from "../config";
import {Nav, NavItem, NavLink, Row, Col,Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup,
     Label, Input } from "reactstrap";

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

    const getAccount = async () => {

        try{
            axios.get(`${config.API_URL}/accounts`).then(response => {
                setAccounts(oldData => {let newData = cloneDeep(oldData); newData.rows = response.data; return newData})
                console.log(response.data)
            });
        }
        catch(error){
            console.log(error)
        }

    }

    const account = useRef({})

    useEffect(() => {
        getAccount();
    }, [])

    const inputData = (event) => {
        
        if(event.target.id === 'A_number'){ account.number = event.target.value}
        else if(event.target.id === 'A_item'){ account.item = event.target.value}
        else if(event.target.id === 'A_originalCost'){ account.originalcost = event.target.value}
        else if(event.target.id === 'A_retailPrice'){ account.retailPrice = event.target.value}
        else if(event.target.id === 'A_installmentPrice'){ account.installmentPrice = event.target.value}
        else if(event.target.id === 'A_advance'){ account.advance = event.target.value}
        else if(event.target.id === 'A_balance'){ account.balance = event.target.value}
    }

    const addAccoout = async () =>{
        try{
            account.discount = 0
            account.closed = false
            account.date_of_sale = new Date().toLocaleDateString()
            const promise = axios.post(`${config.API_URL}/accounts`, account)
        }
        catch (error) {
            console.log(error)
        }
        finally{
            setModalOpen(false)
        }

    }

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
                                    <Input id="A_number" name="Account Number" onChange={inputData} placeholder="Enter Account Number"></Input>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_Customer">Customer</Label>
                                    <Input id="A_Customer" name="Customer Name" onChange={inputData} placeholder="Select Customer"></Input>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_item">Item</Label>
                                    <Input id="A_item" name="Item" onChange={inputData} placeholder="Enter item name"></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="A_originalCost">Original Cost</Label>
                                    <Input id="A_originalCost" type="number" onChange={inputData} placeholder="Enter Cost of Item" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_retailPrice">Retail Price</Label>
                                    <Input id="A_retailPrice" onChange={inputData} placeholder="Enter retail price of item" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_installmentPrice">Installment Price</Label>
                                    <Input id="A_installmentPrice" onChange={inputData} placeholder="Enter installment price" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row> 
                            <Col>
                                <FormGroup>
                                    <Label for="A_advance">Advance Amount</Label>
                                    <Input id="A_advance" onChange={inputData} placeholder="Enter Advance amount" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="A_balance">Balance Amount</Label>
                                    <Input id="A_balance" onChange={inputData} placeholder="Enter Balance amount" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => { setModalOpen(false) }}>Cancel</Button>
                    <Button color="primary" onClick={addAccoout} >Add Account</Button>
                </ModalFooter>
            </Modal>
            <MDBDataTable searching sortable data={accounts} />
        </div>
    );

};

export default Account;