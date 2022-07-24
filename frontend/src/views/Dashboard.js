import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../config";
import { Card, CardTitle, CardText, CardGroup } from "reactstrap"
import "../css/Dashboard.css";
import { jwt } from "jsonwebtoken";
import { useHistory } from "react-router-dom";
import useAuthentication from "../components/useAuthentication";

const Dashboard = () => {

    const [user, setUser] = useAuthentication()
    const [customerNum, setCustomerNum] = useState()
    const [accountNum, setAccountNum] = useState()
    const history = useHistory()

    const getCustomers = async () => {
        try {

            const customerPromise = await axios.get(`${config.API_URL}/customers`, {
                headers: {
                    'x-access-token': user,
                },
            });
            setCustomerNum(await customerPromise.data.length)
        }

        catch (error) {
            console.log(error);
        }
    }

    const getAccounts = async () => {
        try {

            const accountPromise = await axios.get(`${config.API_URL}/accounts`,{
                headers: {
                    'x-access-token': user,
                },
            });
            setAccountNum(await accountPromise.data.length)
        }

        catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getCustomers();
        getAccounts();
    }, [])


    return (
        <div >
            <h1>Dashboard</h1>
            
            <CardGroup className="cardgroup">
            <Card body >
                <CardTitle className="h3"> Total Customers</CardTitle>
                <CardText className="h1">{customerNum}</CardText>
            </Card>
            <Card body>
                <CardTitle className="h3"> Total Accounts</CardTitle>
                <CardText className="h1">{accountNum}</CardText>
            </Card>
            </CardGroup >
            
        </div>
    );

};

export default Dashboard;