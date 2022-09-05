import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import config from "../config";
import Select from 'react-select';
import {
    Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup,
    Card, CardBody, Label, Input, Alert
} from "reactstrap";
import CustomTable from "../components/CustomTable";
import useAuthentication from "../components/useAuthentication";
import { Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { useHistory } from "react-router-dom";
import Notification from "../components/Notification";

const Accounts = () => {

    const [user, setUser] = useAuthentication();
    const history = useHistory();

    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    const [addBtnDisable, setAddBtnDisable] = useState(true);
    const [calculateBtnDisable, setCalculateBtnDisable] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [customerSelectList, setCustomersList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [walletAmount, setWalletAmount] = useState(null)
    const [balance, setBalance] = useState(null)
    const [installmentPrice, setInstallmentPrice] = useState(0);
    const account = useRef({})


    const getAccounts = async () => {
        try {
            const res = await axios.get(`${config.API_URL}/accounts/all`, { headers: { 'x-access-token': user } });
            setAccounts(res.data);
        }
        catch (error) {
            console.log(error)
        }
    }

    const getCustomers = async () => {
        try {
            const customerPromise = await axios.get(`${config.API_URL}/customers/all`, {
                headers: { 'x-access-token': user, },
            });
            const result = customerPromise.data
            setCustomers(result.map(c => { return { ...c, value: c._id, label: c.name } }));
        }
        catch (error) {
            console.log(error);
        }
    }

    const addAccount = async (e) => {
        e.preventDefault();

        try {

            account.current.customer = selectedCustomer.value
            account.current.discount = 0
            account.current.closed = balance === 0 ? true : false;
            account.current.dateOfSale = new Date().toLocaleDateString()
            account.current.monthlyPayments = []
            account.current.balance = balance
            account.current.openingBalance = balance
            account.current.installmentPrice = installmentPrice

            const result = await axios.post(`${config.API_URL}/accounts/add`,
                {
                    account: account.current,
                    wallet: walletAmount
                },
                {
                    headers: { 'x-access-token': user }
                });

            if (result.status === 200) {
                setAccounts(prevState => { prevState.push(result.data); return prevState; })
            }
            account.current = {};
            setModalOpen(false);
            setAddBtnDisable(true);
            setCalculateBtnDisable(false)
            setBalance('');
            setInstallmentPrice('')
            setWalletAmount('')
        }
        catch (error) {
            console.log(error);
        }
    }

    const searchChanged = (e) => {
        if (e) {
            setSearch(e.target.value.trim().toLowerCase());
        }

        const searchText = e ? e.target.value.trim().toLowerCase() : search;

        setFilteredAccounts(searchText ?
            accounts.filter(acc =>
                acc.customer.name.toLowerCase().includes(searchText) || acc.item.toLowerCase().includes(searchText)
            ) : accounts
        );
    }

    const accountCalculation = () => {

        if (account.current.retailPrice && account.current.item && selectedCustomer) {

            setCalculateBtnDisable(true)

            account.current.retailPrice = parseInt(account.current.retailPrice)
            account.current.advance = parseInt(account.current.advance)

            const Installment = parseInt(account.current.retailPrice + (account.current.retailPrice* 0.3))
            setInstallmentPrice(Installment)
            
            let tempBalance = Installment - account.current.advance
            
            if (selectedCustomer.wallet >= tempBalance) {
                tempBalance = walletAmount - tempBalance
                setWalletAmount(tempBalance)
                setBalance(0)
            }
            else {
                setWalletAmount(0)
                setBalance(tempBalance - selectedCustomer.wallet)
            }

            setAddBtnDisable(false);
        }
        else {
            console.log("incomplete")
        }

    }

    useEffect(() => {
        getAccounts();
        getCustomers();
    }, [])

    useEffect(() => {
        searchChanged();
    }, [accounts])



    return (

        <Card>
            <CardBody>
                <h2>Accounts</h2>
                <div style={{ display: "flow-root" }}>
                    <>
                        <Button style={{ float: "right" }} id="addAccountBtn" color="primary" onClick={() => { setModalOpen(!isModalOpen) }}>Add Account</Button>
                    </>
                </div>

                <Modal isOpen={isModalOpen} centered toggle={() => { setModalOpen(!isModalOpen) }} size='lg'>
                    <ModalHeader>Add New Account</ModalHeader>
                    <Form onSubmit={addAccount}>
                        <ModalBody>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="A_number">Account Number</Label>
                                        <Input id="A_number" name="Account Number" onChange={(evt) => { account.current.accountNum = evt.target.value;
                                        setAddBtnDisable(true); 
                                        setCalculateBtnDisable(false)
                                        }} placeholder="Enter Account Number"></Input>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="A_Customer">Customer</Label>
                                        <Select id="A_Customer" isSearchable isClearable onChange={(val) => {
                                            setSelectedCustomer(val);
                                            setWalletAmount(selectedCustomer.wallet);
                                            setAddBtnDisable(true); setCalculateBtnDisable(false)
                                        }}
                                            options={customers} placeholder="Select Customer" />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label>Customer Wallet</Label>
                                        <Input disabled value={walletAmount} style={{ color: selectedCustomer?.wallet !== 0 ? "green" : "red" }} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="A_item">Item</Label>
                                        <Input id="A_item" name="Item" onChange={(evt) => { account.current.item = evt.target.value }} placeholder="Enter item name"></Input>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="A_originalCost">Original Cost</Label>
                                        <Input id="A_originalCost" type="number" onChange={(evt) => { account.current.cost = evt.target.value }} placeholder="Enter Cost of Item" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="A_retailPrice">Retail Price</Label>
                                        <Input id="A_retailPrice" type="number" onChange={(evt) => {
                                            account.current.retailPrice = evt.target.value;
                                            setAddBtnDisable(true); setCalculateBtnDisable(false)
                                        }} placeholder="Enter retail price of item" />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="A_installmentPrice">Installment Price</Label>
                                        <Input id="A_installmentPrice" type="number" disabled value={installmentPrice} placeholder="Installment price" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="A_advance">Advance Amount</Label>
                                        <Input id="A_advance" type="number" onChange={(evt) => {
                                            account.current.advance = evt.target.value;
                                            setAddBtnDisable(true); setCalculateBtnDisable(false)
                                        }} placeholder="Enter Advance amount" />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="A_balance">Balance Amount</Label>
                                        <Input id="A_balance" disabled type="number" value={balance} placeholder="Balance amount" />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={() => {
                                setModalOpen(false); 
                                setAddBtnDisable(true); 
                                setCalculateBtnDisable(false)
                                setBalance('');
                                setInstallmentPrice('')
                                setWalletAmount('')
                            }}>Cancel</Button>
                            <Button color="primary" disabled={calculateBtnDisable} onClick={accountCalculation}>Calculate</Button>
                            <Button color="primary" disabled={addBtnDisable} type="submit" >Add Account</Button>
                        </ModalFooter>
                    </Form>
                </Modal>


                <CustomTable searchable searchEvent={searchChanged} isEmpty={!filteredAccounts.length}>
                    <Thead>
                        <Tr>
                            <Th>Account  Number</Th>
                            <Th>Customer</Th>
                            <Th>Item</Th>
                            <Th>Date of Sale</Th>
                            <Th>Balance</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredAccounts.map(acc => {
                            return (
                                <Tr key={acc._id} onClick={() => history.push(`/Accounts/${acc._id}`)}>
                                    <Td>{acc.accountNum}</Td>
                                    <Td>{acc.customer.name}</Td>
                                    <Td>{acc.item}</Td>
                                    <Td>{acc.dateOfSale}</Td>
                                    <Td>{acc.balance}</Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </CustomTable>
            </CardBody>
        </Card>
    );

};

export default Accounts;