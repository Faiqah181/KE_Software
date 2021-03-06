import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi"
import LabelledText from "../components/LabelledText";
import TertiaryButton from "../components/TertiaryButton"
import DescriptiveButton from "../components/DescriptiveButton";
import CustomTable from "../components/CustomTable";
import { Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

import useAuthentication from "../components/useAuthentication";
import axios from "axios";
import config from "../config";
import "../css/Account.css"


const AccountDetails = () => {

    const [user, setUser] = useAuthentication()
    const params = useParams();
    const id = params.id;
    const [account, setAccount] = useState();
    const [statusDropdown, setStatusDropdown] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const history = useHistory();

    useEffect(() => {
        
        const fetchAccount = async () => {
            try {
                const accountResult = await axios.get(`${config.API_URL}/Accounts/${id}`, {
                    headers: {
                        'x-access-token': user,
                    },
                });
                const fetchedAccount = accountResult.data;
                setAccount(fetchedAccount);
            } catch (error) {
                console.log(error);
                if(error.response?.status === 404) {
                    history.push('/404');
                }
            }
        }

        fetchAccount();
    }, [])

    const accountStatusColor = (acc) => {
        if(acc?.closed === true){
            return "danger";
        }
        else if(acc?.closed === false){
            return "success";
        }
        else return "secondary";
    }

    return (
        <div>
            <TertiaryButton onClick={() => history.push('/Accounts')}>
                <span><BiArrowBack /> Back to Accounts</span>
            </TertiaryButton>
            <div>
                <div className="account-title">Account No: {account?.accountNum}</div>
                <Dropdown isOpen={statusDropdown} toggle={() => {setStatusDropdown(!statusDropdown)}} style={{display: "inline-block"}}>
                    <DropdownToggle color={accountStatusColor(account)}>
                        {
                            account?.closed ? <><BsXCircle /><span style={{marginLeft: "5px"}}>Closed</span></> :
                            <><BsCheckCircle /><span style={{marginLeft: "5px"}}>Open</span></>
                        }
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => {setModalOpen(true); setStatusDropdown(false)}}>
                            Change Status
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Row>
                <Col>
                    <LabelledText name="Item">{account?.item}</LabelledText>
                </Col>
                <Col>
                    <LabelledText name="Customer">{account?.customer.name}</LabelledText>
                </Col>
            </Row>
            <br />
            <Row>
                <LabelledText name="Address">{account?.customer.address}</LabelledText>
            </Row>
            <br />
            <Row>
                <Col>
                    <LabelledText name="Retail Price">{account?.retailPrice}</LabelledText>
                </Col>
                <Col>
                    <LabelledText name="Advance">{account?.advance}</LabelledText>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <LabelledText name="Installment Price">{account?.installmentPrice}</LabelledText>
                </Col>
                <Col>
                    <LabelledText name="Balance">{account?.balance}</LabelledText>
                </Col>
            </Row>

            <CustomTable>
                <Thead>
                    <Tr>
                        <Th>Month</Th>
                        <Th>Payment Received</Th>
                        <Th>Balance</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>January</Td>
                        <Td>5500</Td>
                        <Td>15000</Td>
                    </Tr>
                    <Tr>
                        <Td>February</Td>
                        <Td>8000</Td>
                        <Td>12000</Td>
                    </Tr>
                    <Tr>
                        <Td>March</Td>
                        <Td>25000</Td>
                        <Td>55000</Td>
                    </Tr>
                </Tbody>
            </CustomTable>

            <Modal isOpen={isModalOpen} toggle={() => setModalOpen(!isModalOpen)} centered>
                <ModalHeader style={{borderBottom: "0px"}}>Change Account Status</ModalHeader>
                <ModalBody style={{paddingLeft: "2rem", paddingRight: "2rem"}}>
                        <Row>
                        <DescriptiveButton 
                                color="success" title="Open" 
                                outline={account?.closed === true}
                                checked={account?.closed === false}
                                description={`Set the status of the account to Open.\nPayments are pending in this account.`} 
                            /> 
                        </Row>
                        <Row>
                            <DescriptiveButton 
                                color="danger" title="Close" 
                                outline={account?.closed === false}
                                checked={account?.closed === true}
                                description={`Set the status of the account to closed. \nAccount is resolved and no more payments are to be received`} 
                            /> 
                        </Row>
                        
                </ModalBody>
            </Modal>
        </div>
    )
}

export default AccountDetails;