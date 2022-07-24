import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import LabelledText from "../components/LabelledText";
import axios from "axios";
import config from "../config";
import "../css/Account.css"
import useAuthentication from "../components/useAuthentication";

const Account = () => {

    const [user, setUser] = useAuthentication()
    const params = useParams();
    const id = params.id;
    const [account, setAccount] = useState();
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
                
                if(!fetchedAccount){
                    history.push('/404')
                }
                setAccount(fetchedAccount);
                console.log(fetchedAccount);    
            } catch (error) {
                console.log(error);
            }
        }

        fetchAccount();

        setAccount({
            account_num: 656512,
            item: 'YBR 125G',
            cost: 2000,
            retail_price: 2500,
            installment_price: 100,
            advance: 200,
            balance: 0,
            customer_id: '6296e28ce2f8b2bbf684ee12',
            discount: 0,
            closed: true,
            date_of_sale: '7/17/2022'
        })
    }, [])

    const accountStatusColor = () => {
        if(account?.closed === true){
            return "danger";
        }
        else if(account?.closed === false){
            return "success";
        }
        else return "secondary";
    }

    return (
        <div>
            <div>
                <div className="account-title">Account No: {account?.account_num}</div>
                <Button color={accountStatusColor()}>
                    {
                        account?.closed ? <><BsXCircle /><span style={{marginLeft: "5px"}}>Closed</span></> :
                        <><BsCheckCircle /><span style={{marginLeft: "5px"}}>Open</span></>
                    }
                </Button>
            </div>
            <Row>
                <Col>
                    <LabelledText name="Item">{account?.item}</LabelledText>
                </Col>
                <Col>
                    <LabelledText name="Customer">{account?.customer_id}</LabelledText>
                </Col>
            </Row>
            <br />
            <Row>
                <LabelledText name="Address">{account?.customer_id}</LabelledText>
            </Row>
            <br />
            <Row>
                <Col>
                    <LabelledText name="Retail Price">{account?.retail_price}</LabelledText>
                </Col>
                <Col>
                    <LabelledText name="Advance">{account?.advance}</LabelledText>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <LabelledText name="Installment Price">{account?.installment_price}</LabelledText>
                </Col>
                <Col>
                    <LabelledText name="Balance">{account?.balance}</LabelledText>
                </Col>
            </Row>
        </div>
    )
}

export default Account;